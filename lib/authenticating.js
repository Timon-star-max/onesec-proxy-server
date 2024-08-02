const loadingPage = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Onesec Authenticating...</title>
<style>
    html, body {
        height: 100%;
        margin: 0;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f0f0f0;
    }
    .spinner {
        width: 80px;
        height: 80px;
        border: 10px solid rgba(0, 0, 0, 0.1);
        border-left-color: #333;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .loading-text {
        margin-top: 20px;
        font-size: 24px;
        color: #333;
    }
</style>
</head>
<body>
    <div class="centered">
        <div class="spinner"></div>
        <div class="loading-text">Onesec Authenticating...</div>
    </div>
</body>
</html>
`;

module.exports = loadingPage;
