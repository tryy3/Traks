#Traks
##Developers
Dennis Planting, Michael Leng, Max Campbell

##What Is Traks?
Traks is a web application that visualizes train movements throughout the UK using data from https://datafeeds.networkrail.co.uk/ntrod/. Traks was created in a 48 hour timespan during the February 2016 Koding Inc. hackathon.

##Train Information
Each train can also be clicked on to reveal additional information. Upon clicking a particular train, the map will center around it and a sidebar will appear. There are a few options in the train information panel available for use:
1. Toggle Spin: This will continuously spin the currently selected train.
2. Toggle Route: This will show the past and future path of the currently selected train.
3. Toggle Follow: This will move the map to follow the currently selected train
4. Close: This will close the sidebar.

##Filtering
There are three different filter types:
1. Train ID: Filter train by its unique ID.
2. Stations: Filter trains that have passed or are going to pass a specific station.
3. Companies: Filter trains run by a specific company.
You can have multiple filters on and with the companies, you can select multiple companies, to make sure you always see what you need to see.

##Other Notes
1. Some train headings may be slightly off from its actual heading. This is due to some inherent error in the calculation of the train's bearing.
2. Depending on the time this web application is viewed, either a large or small number of trains may be displayed (due to time zone differences). If none or very few trains are displayed, please use the "Test Page" page.
3. We only have access to live train data for trains in the UK. As such, this web application only displays trains in the UK (for now).
4. The exact positions, arrival times, and some other data may not match exactly to the train's actual movements, actual arrival times, etc. Some data is calculated and extrapolated from the data provided from the live feed.
5. This web application has not been completely optimized for page load speed and efficiency. You may see some performance decreases if the page remains open for some time.
6. Rails.json is a combination of RailReferences.csv and tiplocs.csv; RailReferences is provided by [NAPTAN](http://data.gov.uk/dataset/naptan) and tiplocs is processed from Network Rail data from [Tom Cairns](http://www.thomas-cairns.co.uk/)