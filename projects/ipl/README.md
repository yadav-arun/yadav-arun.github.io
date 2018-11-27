# IPL Project for SocialCops

> Data analysis from csv and visualizing it on to a dashboard.

## Libraries Used

- **Angular** AngularJS for web framework library, uses UI-Router to route the page to the dashboard home screen and to follow mvc architecture.
- **Datatables** To visualize data in form of tabular form.
- **Papaparse** To parse the csv files, and convert the data to JSON.
- **Morris** To visualize the graphs (Donut and Bar chart)
- **jQuery** - for usage in other libraries like Datatables
- **Bootstrap** - For css and providing responsiveness.


## Bonus Points

- **Web-app in vue.js** -  No, I have created the app in AngularJS, as Vue.js was less known to me, I have 5 day week in office, right now, so working on learning in this short span and visualizing the data would take longer.
- **Optimize the loading time** - Yes, Loading time is optimized, as use of Web Workers is made for processor intensive calculation of deliveries data. Also loading of the bigger csv file is done on workers using papaparse. Though more changes can be made, like removing of unused css, but that would lead me to load the css file from my local, and not through CDN. And that would affect too. (What can be done in that case ? Ans. Use of cloudflare is a possibility, that will cache the files and thus load faster, also the page has been hosted on github pages, if there would have been any server space, apache or nginx configuration can be modified so as to get the data faster.). Also minifying the code and combining to single file is also a possible case that hasn't been handled.
- **Mobile responsive** - Yes, the dashboard single screen is mobile responsive. Using bootstrap, the page has been made responsive for view in mobile tablet and standard screen desktop.
- **Progressive web-app** - Yes, The app is a PWA, Add to home screen alert is asked if the user visits the page after the span of 5 minutes again on the mobile chrome browser. Manifest is added, thus providing access to a fullscreen app, icons and theme colors are added in meta tags, Service worker is used, thus data is cached. Though notification module can also be added, I felt no scope as of the current dashbaord view, so notification wasn't added.
- **Offline usable** - Yes, the dashboard is offline usable. Some unique changes are made. while accessing the dashboard, if internet connection disconnects, the cached data is shown from service worker, further, if the cache is cleaned, the user might not access the dashboard, but is provided with a separate page, which, as of now reads as, the page is offline.

## Live Demo

You can see a live demo of this project [Here](https://yadav-arun.github.io/projects/ipl/#/dashboard/home/).

#### Created by **Arun Yadav**
