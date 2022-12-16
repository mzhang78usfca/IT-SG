# IT @ Singapore (IT@SG)
## Description
This is a website showing the data visualizations that was used in the project, 
finished by [Muzhi Zhang](mailto:mzhang78@usfca.edu).

## Project Abstract
This project aims to search for data that can
represent how fast IT industries in Singapore grew during and
after Covid-19 pandemic, and uses modern data visualization
techniques to visualize these sets of data.

## Installation
### A. Check Compiled Result Directly
1. This project is hosted on GitHub Pages. The whole website can be directly accessed at [IT @ Singapore](https://mzhang78usfca.github.io/IT-SG/)
2. The project report (in compiled pdf format) can also be found at GitHub Pages website. You can also find a copy at 
[HERE](./report/IT%20Singapore%20Final%20Report.pdf)

### B. Run Website Locally
You can run the website locally by building up any kind of built-in web-server that points to the [/docs](./docs) folder.

An example of running the web-server under Mac-OS and php package (with preinstalled HomeBrew) would be:

```bash
brew install php
cd absolute-path-to-this-folder/docs
php -S localhost:8080
```

Then the website can be accessed at ```http://localhost:8080/```

If you have different environment, Google by yourself how to start local web-server.

Notice that although no packages are required for installation, the website will still access remote packages using CDN. Please 
make sure that you have internet access to following CDN links:

- D3 Version 7 at [https://d3js.org/d3.v7.min.js](https://d3js.org/d3.v7.min.js).
- D3 Legend Version 2.25.6 at [https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js](https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js)

The website was tested under Chrome 108.0.5359.98 and Safari 16.1 (18614.2.9.1.12) with no obvious rendering error.

### C. Compile Report
You can access the tex file at [/report/itsg.tex](./report/itsg.tex). Using it on any local LaTeX with attached images 
and bib file to compile the report.

Specific required packages when compiling are written in [/report/itsg.tex](./report/itsg.tex).

The LaTeX file was built using [IEEE conferences template](https://www.overleaf.com/latex/templates/ieee-bare-demo-template-for-conferences/ypypvwjmvtdf).

## Slide and Recording
You can find slide at [/slides](./slides) folder and recording at [/recording](./recording) folder.
