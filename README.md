# Shapefile Viewer
Are you looking for a easy to use `shapefile viewer on macOS`? `Ginkgoch` provides a utility to view shapefile's geometries and properties for free.

* For Mac [Download](https://github.com/ginkgoch/node-shapefile-viewer/releases/download/0.1.1/Ginkgoch-macOS-x64.zip)
* For Windows [Download](https://github.com/ginkgoch/node-shapefile-viewer/releases/download/0.1.0/Ginkgoch.Shapefile.Viewer-win32-ia32.zip)

![Overview](https://github.com/ginkgoch/node-shapefile-viewer/raw/develop/screenshots/overview.png)

## Features
1. Load shapefile
1. Export to another data format
    * GeoJson
    * CSV
1. Render shapefile on a map
1. List all properties in the bottom table
1. Click to highlight an area on map and show the detail information
1. Select a table row to highlight an area on map and show the detail information
1. Map interaction ([Leaflet](https://leafletjs.com) supports, consider to switch render engine)
1. macOS compatible

## Overview
![Overview-workspace](https://github.com/ginkgoch/node-shapefile-viewer/raw/develop/screenshots/overview-structure.png)

Here introduces the workspaces of the UI. There are generally 5 sections.

1. `Menus` which is on the top of the screen
1. `Toolbar` with functional buttons. Hover on the buttons to get detail.
1. `Community` are some quick buttons to navigate to where you could see the project, report issues and feedback.
1. `Map` provides a visualization of the shapefile. It also allows to identify a geometry and see its properties.
1. `Properties` provides a table of all the properties maintained in the shapefile.

## Quick Started
### Open a shapefile
There are two ways to open a specifid shapefile. There are on the menu on the very top and the open button on the toolbar. Select a shapefile from the popup dialog.

![Open a shapefile](https://github.com/ginkgoch/node-shapefile-viewer/raw/develop/screenshots/open.png)

### Shapefile loaded
After the shapefile is loaded, a map visualizes on the `Map` and its properties displays on the `Properties` area.

### Identify features
There are two entires to identify a feature and make it highlighted.
1. Click an area on the `Map`; if there is any near by feature, it will highlights with a different fill color, its properties will be rendered in a popup.
1. Select one row on the `Properties` table also navigates you to its corresponding feature.

### Export
Currently, we support `GeoJson` and `CSV` file formats as target data format. Once one shapefile is loaded, then click the `Menu` > `File` > `Export` and select either format you want to convert to.

You could also find the `Export` button as well on the second position of the quick `Toolbox` space.

## Issues
Contact [ginkgoch@outlook.com](mailto:ginkgoch@outlook.com) or [sumbit an issue](https://github.com/ginkgoch/node-shapefile-reader/issues).
