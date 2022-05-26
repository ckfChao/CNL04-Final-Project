from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from datetime import timedelta
import os

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
app.config['SECRET_KEY'] = os.getenv('SESSION_SECRET')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
CORS(app)

@app.route('/api/', methods=['GET'])
@cross_origin()
def index():
    return {
        "tutorial": "Flask React"
    }

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run()