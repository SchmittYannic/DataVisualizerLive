# DataVisualizerLive

A Visualization Creation Tool for interactive diagrams using D3 library.
Upload dataset in form of a csv file and create different charts to represent the underlying data.

This is the javascript version of the project. The typescript version is saved in this repository [here](https://github.com/SchmittYannic/DataVisualizer). Only the typescript version will receive updates in the future.

## Table of Contents

- [DataVisualizerLive](#project-name)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Implementation Details](#implementation-details)
  - [Demo](#demo)
  - [Installation](#installation)

## Description

This project allows a user to upload a dataset in csv format and generate various charts to visualize the data. It utilizes react in the frontend and D3 for chart creation. The main purpose of the project was for me to learn more about react and chart creation with D3 library.

The chart creation process can be divided into 3 Steps.
 - In the upload step a csv file is uploaded to the site. Alternativly a user can choose to test the tool with one of the two provided demo datasets. It is adviced to do basic data cleaning operations on a dataset before uploading it to DataVisualizer to ensure the created visualization work as intended. It is essential to use a dot (.) as the decimal seperator of numerical data, otherwise the numerical data will be parsed as a string.
 - The data step shows the uploaded data inside a table. This allows a user to check, if his dataset was successfully uploaded and parsed. The table is build using tanstack table because it provides an easy way to include pagination, sorting, filtering and editing functionality to the table.
 - In the final visualization step a diagram is created using D3. Through the diagram configuration menu a user can change the chart type, text content (titel, axis label) and characteristics of the elements inside the chart (color, size). DataVisualizer supports the following chart types: barchart, piechart, boxplot, linechart, areachart, histogram, scatterplot. However there are prerequisites for the dataset to be able to use certain chart types (more details [here](#chart-requirements)). In the end the diagram can be download as an svg, which has the downside of it losing its interactivity. Alternativly both the svg and a script tag can be copied to the clipboard. Pasting them together into a html file will ensures the diagrams interactivity remains preserved.
 
 
 ## Implementation Details

 ### Upload, Parsing and State Management
 The uploaded dataset in the upload step is being parsed using papaparse and then saved in the state of the application. No state management library was used in this project. Instead the data state is being managed inside a react context.

 ### Classification of Data
 After a new dataset is uploaded the application investigates the characteristics of the underlying data. 
 
 First the column names are taken from the very first row. This can cause issues when no column names are present in the uploaded dataset.

 In a second step the amount of unique values existing in each column of the data aswell as the different data types is being looked into for classification purposes. If a column holds mostly number values it is classified as being a column with numeric data. If a column has less than 11 unique values it is being classified as a column containing categorical data (a column can be classified as both numerical and categorical).

 If a column holds mostly string values it is being considered of being a date column (column holding datetime data). In this case the application tries parsing the string into a Date format. If this parsing fails for even one value inside a column it is not considered a date column. So in its current implementation even if all but one value of a column is date data it will not be considered a date column by the application. The reason for this approach was the nature of how the line- and areachart would handle receiving non date data. In future implementations the line- and areachart will skip every value that isnt parsable into datetime.

 At the end of the classification process the application saves the column names of numerical, categorical and date columns inside its state.

 ### Chart Requirements
 The individual chart types supported by DataVisualizer all have their own data requirements for the input data.

 - barchart: atleast 1 categorical classified column inside the dataset
 - piechart: atleast 1 categorical classified column inside the dataset
 - boxplot: atleast 1 numerical classified column inside the dataset
 - histogram: atleast 1 numerical classified column inside the dataset
 - scatterplot: atleast 1 numerical classified column inside the dataset (while not required for chart creation a scatterplot logically only makes sense with atleast 2 different numerical columns)
 - linechart: atleast 1 numerical AND 1 date classified column inside the dataset
 - areachart: atleast 1 numerical AND 1 date classified column inside the dataset
 


## Demo

A live demo of the project is hosted [here](https://data-visualizer-live.vercel.app/) using [Vercel](https://vercel.com).


## Installation

Clone Repository using git bash.

```bash
$ git clone https://github.com/SchmittYannic/DataVisualizerLive.git
```

Open Project in an Editor like Visual Studio Code.

```bash
$ npm install
```

Installs all required npm packages 


```bash
$ npm start
```

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

```bash
$ npm run build
```
Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.