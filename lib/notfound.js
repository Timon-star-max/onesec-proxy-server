const notFoundPage = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>404 Not Found</title>
<style>
    html, body {
        height: 100%;
        margin: 0;
        font-family: Arial, sans-serif;
    }
    .centered {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        color: #333;
    }
    p {
        font-size: 14px; /* corrected font-size property */
    }
</style>
</head>
<body>
    <div class="centered">
        404 Not Found
        <p>Currently, the relevant site has not been hosted. Click <a href="${process.env.MAIN_SITE_URL}">here</a> to host.</p>
    </div>
</body>
</html>
`;

module.exports = notFoundPage;