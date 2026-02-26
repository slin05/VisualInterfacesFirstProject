# Protein and Height

## Motivation:
My goal with this project was to see if there was a correlation between height for males and females and protein consumption. I also added in GDP to see if the countries GDP is higher, then would they consume more protein?

## Data Description + Links:
I used 2016-2019 data, sourced from these links:

GDP: 
https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database
Male Height:
https://ourworldindata.org/grapher/average-height-of-men?country=Sub-Saharan+Africa~Middle+East+and+North+Africa~OWID_NAM~Latin+America+and+Caribbean
Female Height:
https://ourworldindata.org/grapher/average-height-of-women?country=Sub-Saharan+Africa~Middle+East+and+North+Africa~OWID_NAM~Latin+America+and+Caribbean
Protein Supply:
https://ourworldindata.org/grapher/daily-per-capita-protein-supply

## Sketches
I designed these through changing the CSS and HTML to "sketch" it out before committing to anything.

## Visualization components + interactions + screenshots
So I tried my best to do a dashboard layout, this website is designed for a 1440px screen. 
There is a dropdown at the top for the year:
<img width="300" height="78" alt="image" src="https://github.com/user-attachments/assets/dd97cd0c-f30f-4df0-8975-0cd600bb28d2" />

There is also two histograms:

<img width="400" height="250" alt="image" src="https://github.com/user-attachments/assets/9c808085-2c05-4f7c-b399-a4a81a05bbaa" />
<img width="403" height="234" alt="image" src="https://github.com/user-attachments/assets/933b8684-4f3a-4f4a-a76a-b254b82140e3" />

One scatterplot map:

<img width="609" height="254" alt="image" src="https://github.com/user-attachments/assets/facd3d2b-21a2-4c5e-865f-7fa6fc7ec19f" />

Two choropleth maps that show world and have down drops for the things you want to compare and contrast:

<img width="352" height="354" alt="image" src="https://github.com/user-attachments/assets/30abe5b2-2428-4621-b46d-9729e2562731" />

## Findings with screenshots:
Europe has the highest height overall, especially iceland:
<img width="691" height="260" alt="image" src="https://github.com/user-attachments/assets/487cd259-a1d8-4c6f-b810-a25e167b3960" />

Some countries (China for example) consume lots of protein but still see no improvement in height:
<img width="382" height="362" alt="image" src="https://github.com/user-attachments/assets/a7760f75-dcc7-410d-9013-df44cbb248c1" />
<img width="408" height="342" alt="image" src="https://github.com/user-attachments/assets/621778e8-796a-4bce-8c51-0424cb59a39e" />

## Process
Libraries used:
D3 for all Visualization
Vanilla HTML, CSS, and JS

Folder structure:
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── data/
    ├── average_heightnutrition.csv
    └── world.geojson
    
Website:
https://slin05.github.io/VisualInterfacesFirstProject/
Github Repo:
https://github.com/slin05/VisualInterfacesFirstProject

Dimensions required: 1440px screen width and height!

## Challenges and Future Work
I think the biggest challenge was trying to fit everything into the dashboard view, which I still didn't manage in the end. I had to settle for something that wasn't responsive to the layout, but still tried my best to display most if not all visualizations at the same time on screen.

Future work:
Responsive layout (will do my best to implement a responsive layout that works on any screen.)
Map brushing (so that people can brush over a area, allowing to select multiple instead of just one country.)

## AI USE
I used AI to debug errors that I would get while trying to push new layouts, for example: I had no visualizations show up for one and realized I made a spelling mistake in the csv file, which was why it didn't show up.

## Demo Video
[TO BE PLACED HERE]
