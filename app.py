from flask import Flask, json, redirect, jsonify, render_template
import pandas as pd
from splinter import Browser
from webdriver_manager.chrome import ChromeDriverManager
import os
import requests
from bs4 import BeautifulSoup as bs


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/lifeexpectancy/')
def lifeexpectancy():
    return render_template('lifeexpectancy.html')

@app.route('/api/data')
def data():
	df = pd.read_csv('Resources/world-happiness-report-2021.csv')
	df_filtered = df[["Country name", "Regional indicator", "Ladder score"]]
	df_filtered_renamed = df_filtered.rename(columns={'Country name': 'Country', 'Regional indicator': 'Region', 'Ladder score': 'Rating'})
	df_json = df_filtered.to_json(orient = 'records' )
   	#return df_filtered.to_json(orient = 'records' )
	#return json.dumps(df_json)
	return df_filtered_renamed.to_json(orient='records')

@app.route('/api/ledata')
def leData():
	df = pd.read_csv('Resources/world-happiness-report-2021.csv')
	df_filtered = df[["Country name", "Regional indicator", "Healthy life expectancy"]]
	df_filtered_renamed = df_filtered.rename(columns={'Country name': 'Country', 'Regional indicator': 'Region', 'Healthy life expectancy': 'lifeexpectancy'})
	df_json = df_filtered.to_json(orient = 'records' )
   	#return df_filtered.to_json(orient = 'records' )
	#return json.dumps(df_json)
	return df_filtered_renamed.to_json(orient='records')


if __name__ == '__main__':
    app.run(debug=False)