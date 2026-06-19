import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Quiet logs for cleaner output, but still print key server operations
        pass

if __name__ == "__main__":
    # Ensure working directory is the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    url = f"http://localhost:{PORT}"
    print(f"Starting server for Deepika's Portfolio...")
    print(f"Serving files from: {os.getcwd()}")
    print(f"Opening browser at: {url}")
    print("Press Ctrl+C to stop the server.")
    
    # Auto-open the web page in browser
    webbrowser.open(url)
    
    with socketserver.TCPServer(("", PORT), PortfolioHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped successfully.")
