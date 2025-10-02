# Simple Python app for Google App Engine frontend service
# This handles routing and serves static files

from flask import Flask, request, redirect
import requests
import os

app = Flask(__name__)

# Backend API URL
BACKEND_URL = "https://api-dot-backtosource-prod.appspot.com"

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy_api(path):
    """Proxy API requests to backend service"""
    try:
        url = f"{BACKEND_URL}/api/{path}"
        
        if request.method == 'GET':
            resp = requests.get(url, params=request.args)
        elif request.method == 'POST':
            resp = requests.post(url, json=request.get_json(), params=request.args)
        elif request.method == 'PUT':
            resp = requests.put(url, json=request.get_json(), params=request.args)
        elif request.method == 'DELETE':
            resp = requests.delete(url, params=request.args)
        elif request.method == 'PATCH':
            resp = requests.patch(url, json=request.get_json(), params=request.args)
        
        return resp.content, resp.status_code, resp.headers.items()
    
    except Exception as e:
        return {"error": "Backend service unavailable"}, 503

@app.route('/')
def home():
    """Serve main chatbot application"""
    return redirect('/simple-chatbot.html')

@app.route('/health')
def health():
    """Health check endpoint"""
    return {"status": "healthy", "service": "frontend"}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))