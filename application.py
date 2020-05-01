import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = dict()

@app.route("/")
def index():
    print(f'channles from index {channels}')
    return render_template('index.html', current_channels=channels.keys())

@socketio.on('create channel')
def create_channel(data):
    print(channels)
    if data['channel'] in channels:
        emit('already created', {'message': f'the channel \"{data["channel"]}\" has already been created'}, broadcast=True)
    else:
        new_channel = data['channel']
        channels[new_channel] = []
        emit('new channel', {'channel_name': new_channel}, broadcast=True)

@app.route('/<string:name>')
def channel(name):
    print(f'name: {name}')
    return name
