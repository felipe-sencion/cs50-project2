import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_url_path='/static')
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = dict()

@app.route("/")
def index():
    return render_template('index.html', current_channels=list(channels.keys()))

@socketio.on('create channel')
def create_channel(data):
    if data['channel'] in channels:
        emit('already created', {'message': f'the channel \"{data["channel"]}\" has already been created'}, broadcast=True)
    else:
        new_channel = data['channel']
        channels[new_channel] = []
        emit('new channel', {'channel_name': new_channel}, broadcast=True)

@app.route('/<string:name>')
def channel(name):
    if not name in channels:
        return jsonify({'success': False})
    else:
        return jsonify({'success': True, 'name': name, 'messages': channels[name]})

@socketio.on('post message')
def post_message(data):
    if len(channels[data["channel"]]) == 100:
        channels[data["channel"]].pop(0)
    channels[data["channel"]].append((data["user"], data["datetime"], data["message"]))
    emit('new message', {'channel': data["channel"], 'message': data["message"], 'user': data["user"], 'datetime': data["datetime"]}, broadcast = True)
