from flask import Flask, json, redirect, jsonify, render_template
import pandas as pd



app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/data')
def data():
    return pd.read_csv('Resources/world-happiness-report-2021.csv').to_dict()