from flask import Flask, json, redirect, jsonify, render_template
import pandas as pd


#Initiate Flask app
app = Flask(__name__)


#Handle the default route and render the index.html
@app.route('/')
def home():
    return render_template('index.html')

#Handle the life expectancy route and render the lifeexpectancy.html
@app.route('/lifeexpectancy/')
def lifeexpectancy():
    return render_template('lifeexpectancy.html')

#Handle the api/data route and return the required data in JSON format
@app.route('/api/data')
def data():
	#Read the data(CSV File).
	df = pd.read_csv('Resources/world-happiness-report-2021.csv')
	# Make a Dataframe with the required columns.
	df_happiness = df[["Country name", "Regional indicator", "Ladder score"]]
	# Rename the columns as required.
	df_happiness_renamed = df_happiness.rename(columns={'Country name': 'Country', 'Regional indicator': 'Region', 'Ladder score': 'Rating'})
	
	#Convert the dataframe to JSON and return it.
	happinessRatingsJSON = df_happiness_renamed.to_json(orient = 'records' )
	return happinessRatingsJSON

#Handle the /api/ledata route and return the required data in JSON format
@app.route('/api/ledata')
def leData():
	#Read the data(CSV File).
	df = pd.read_csv('Resources/world-happiness-report-2021.csv')
	# Make a Dataframe with the required columns.
	df_life_expectancy = df[["Country name", "Regional indicator", "Healthy life expectancy"]]
	# Rename the columns as required.
	df_life_expectancy_renamed = df_life_expectancy.rename(columns={'Country name': 'Country', 'Regional indicator': 'Region', 'Healthy life expectancy': 'lifeexpectancy'})
	
	#Convert the dataframe to JSON and return it.
	lifeExpectancyJSON = df_life_expectancy_renamed.to_json(orient = 'records' )
	return lifeExpectancyJSON


#Run the flask server in Production mode. 
#Tried running the server in debug mode and that never works
if __name__ == '__main__':
    app.run(debug=False)