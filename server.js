require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const httpProxy = require('http-proxy');
const NodeCache = require('node-cache');
const supabase = require('./lib/supabase');
const notFoundPage = require('./lib/notfound');
const loadingPage = require('./lib/authenticating');

const { promisify } = require('util');

const proxy = httpProxy.createProxyServer({
	secure: true,
	changeOrigin: true,
	autoRewrite: true,
	followRedirects: true, // Ensure redirects are followed
});

const proxyWebAsync = promisify(proxy.web).bind(proxy);

const cache = new NodeCache({ stdTTL: 300 });

async function getGateway(subdomain) {
	const cacheKey = `gateway-${subdomain}`;
	const cached = cache.get(cacheKey);

	if (cached) {
		return cached;
	}

	let { data, error } = await supabase
		.from('Site')
		.select('ipns_url')
		.or(`dns_at.eq.${subdomain},subdomain_at.eq.${subdomain}`)
		.single();

	if (!data) {
		console.log("sldkfkdsalf")
		if (error) {
			console.error('Error fetching data from Site table:', error);
		}

		console.log(subdomain)

		({ data, error } = await supabase
			.from('BuildLog')
			.select('ipns_url')
			.eq('subdomain_at', subdomain)
			.single());

			console.log(data)


		if (error) {
			console.error('Error fetching data from BuildLog table:', error);
			return null;
		}

		if (data) {
			console.log('Found in BuildLog table:', data);
		}
	} else {
		console.log('Found in Site table:', data);
	}

	const url = data ? data.ipns_url : null;

	if (url) {
		cache.set(cacheKey, url);
	}

	return url;
}


// Ensure the proxyRes event handler is set up only once
proxy.on('proxyRes', (proxyRes, req, res) => {
	const locationHeader = proxyRes.headers['location'];
	if (locationHeader) {
		proxyRes.headers['location'] = locationHeader.replace(req.headers['host'], `https://${req.headers.host}`);
	}
});

fastify.get('/*', async (request, reply) => {
	const subdomain = request.headers.host.split('.')[0];

	try {
		const ipfsGatewayURL = await getGateway(subdomain);
		if (ipfsGatewayURL) {
			await proxyWebAsync(request.raw, reply.raw, {
				target: ipfsGatewayURL,
				headers: {
					host: request.headers.host
				}
			});
		} else {
			if (!reply.sent) {
				reply.status(404).type('text/html').send(notFoundPage);
			}
			reply.type('text/html').send(loadingPage);
		}
	} catch (error) {
		fastify.log.error('Error fetching gateway URL:', error);
		if (!reply.sent) {
			reply.status(500).send('Server error');
		}
	}
});

const port = process.env.PORT || 3000;
fastify.listen({ port: port, host: '0.0.0.0' })
	.then(() => console.log(`Server listening on http://localhost:${port}`))
	.catch(err => {
		fastify.log.error('Server failed to start:', err);
		process.exit(1);
	});
