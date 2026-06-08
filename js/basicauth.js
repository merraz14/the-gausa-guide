const sitePassword = "LoveFromHarryAndMarion";
const enteredPassword = prompt("Enter password:");

if (enteredPassword !== sitePassword) {
  document.documentElement.innerHTML = `
    <head>
      <title>Access denied</title>
      <style>
        body {
          margin: 0;
          min-height: 100vh;
          display: grid;
          place-items: center;
          font-family: system-ui, sans-serif;
          background: #111827;
          color: white;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <main>
        <h1>Access denied</h1>
        <p>Sorry, this page is private.</p>
      </main>
    </body>
  `;
}