// test 
async function init() {
    const express = (await import('express')).default;
    const Docker = (await import('dockerode')).default;
    const http = (await import('http')).default;
    const { Server } = (await import('socket.io'));
    const { AnsiUp } = await import('ansi_up');

    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);
    const docker = new Docker();
    const port = 3000;

    // Start the container and run an interactive shell
    async function startContainer() {
        try {
            const container = await docker.createContainer({
                Image: 'archlinux', // Use your Docker image
                Tty: true,
                OpenStdin: true,
                StdinOnce: false,
            });

            await container.start();
            console.log('Container started:', container.id);
            return container;
        } catch (err) {
            console.error('Error creating or starting container:', err);
            return null;
        }
    }

    // Attach to the container's shell
    async function attachToContainer(container) {
        const exec = await container.exec({
            Cmd: ['/bin/sh'], // Change this to the shell of your Docker image
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
        });

        const stream = await exec.start({ hijack: true, stdin: true });
        return stream;
    }

    // Serve the terminal interface
    app.get('/', (req, res) => {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>berm</title>
                <link rel="icon" href="data:image/svg+xml, <svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;48px&quot; height=&quot;48px&quot; viewBox=&quot;0 0 48 48&quot;> <polyline points=&quot;7,17 20,24 7,31&quot; stroke-width=&quot;5&quot; fill=&quot;none&quot; stroke=&quot;%23FFFFFF&quot;/> <line x1=&quot;23&quot; y1=&quot;36&quot; x2=&quot;38&quot; y2=&quot;36&quot; stroke-width=&quot;5&quot; stroke=&quot;%23FFFFFF&quot;/> </svg>" type="image/svg+xml">                   
                  <style>
                    body { font-family: monospace; background: black; color: white; }
                    #terminal { height: 90vh; overflow-y: scroll; white-space: pre; }
                    input { width: 100%; background: black; color: white; border: none; outline: none; }
                </style>
            </head>
            <body>
                <div id="terminal"></div>
                <input id="input" autofocus />
                <script src="/socket.io/socket.io.js"></script>
                <script>
                    const terminalDiv = document.getElementById('terminal');
                    const inputField = document.getElementById('input');
                    const socket = io();

                    socket.on('output', (data) => {
                        terminalDiv.innerHTML += data; // Append output to terminal
                        terminalDiv.scrollTop = terminalDiv.scrollHeight; // Auto-scroll
                    });

                    inputField.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter') {
                            const input = inputField.value;
                            socket.emit('input', input); // Send input to server
                            inputField.value = ''; // Clear input field
                        }
                    });
                </script>
            </body>
            </html>
        `);
    });

    // Socket.IO handling
    io.on('connection', async (socket) => {
        // Start the Docker container
        const container = await startContainer();

        if (!container) {
            socket.emit('output', 'Error: Could not start container.\n');
            return;
        }

        // Attach to the container's shell
        const stream = await attachToContainer(container);

        // Initialize AnsiUp
        const ansi_up = new AnsiUp();

        // Handle Docker container stream
        stream.on('data', (data) => {
            const cleanedData = data.toString(); // No need to filter manually
            const formattedData = ansi_up.ansi_to_html(cleanedData); // Let AnsiUp handle the ANSI codes

            // Emit cleaned output to client
            socket.emit('output', formattedData);
        });

        socket.on('input', (input) => {
            stream.write(input + '\r'); // Send input to container shell with carriage return
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            container.kill(); // Kill container on disconnect
        });
    });

    // Start the server
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

// Initialize the application
init().catch(err => {
    console.error('Error initializing application:', err);
});
