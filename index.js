server = 'https://geoserver.threefunkymonkeys.com';
namespace = {
  name: 'geodashboard',
  url: 'http://geodashboard.org'
};

const property_type = {
  property: 'property_type',
  values: {
    'apartment': { color: '#1f78b4' },
    'house': { color: '#a6cee3' },
    'PH': { color: '#02818a' },
    'store': { color: '#41ab5d' },
  },
}

const category = {
  property: 'category',
  values: {
    'A': { color: '#a63603' },
    'B': { color: '#e6550d' },
    'C': { color: '#fd8d3c' },
    'D': { color: '#fdbe85' },
  },
}

const dashboard = new GeoDashboard.Dashboard({
  container: document.getElementsByClassName('dashboard')[0],
  header: {
    title: 'GeoDashboard Demo',
    logo: './geo-dashboard-white.png',
  },
  map: {
    center: [-58.38, -34.61],
    zoom: 15,
  },
  filters: [new GeoDashboard.Filter({
    property: 'surface_total_in_m2',
    operator: '>=',
    value: '100'
  })],
});

dashboard.addBaseLayer(new GeoDashboard.OSMLayer({
  visible: true,
}));
dashboard.addBaseLayer(new GeoDashboard.BingLayer({
  key: 'AlMSfR3F4khtlIefjuE_NYpX403LdlGiod36WLn8HlawywtSud-NSgEklCemD5pR',
}));

dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
  title: 'Properties by Type',
  server: server,
  layer: 'geodashboard:properati',
  exclusive: true,
  visible: true,
  popup: [{
    property: 'image_thumbnail',
    format: (value) => {
      if (!value) return null;
      return `<a target="_blank" href="${value}"><img src="${value}"/></a>`;
    },
  },{
    title: 'State',
    property: 'state_name',
  },{
    title: 'Place Name',
    property: 'place_name',
  },{
    title: 'Rooms',
    property: 'rooms',
  }, {
    title: 'Price',
    property: 'price',
  },{
    property: 'properati_url',
    format: (value) => {
      if (!value) return null;
      return `<a style="width:100%;display:block;text-align:right;font-size:1.3em;text-decoration:none;" target="_blank" href="${value}">ℹ️</a>`;
    },
  }],
  style: property_type,
  attribution: 'Datos provistos por <a href="https://www.properati.com.ar">Properati</a>',
}));

dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
  title: 'Properties by Category',
  server: server,
  layer: 'geodashboard:properati',
  exclusive: true,
  visible: false,
  popup: [{
    property: 'image_thumbnail',
    format: (value) => {
      if (!value) return null;
      return `<a target="_blank" href="${value}"><img src="${value}"/></a>`;
    },
  }, {
    title: 'State',
    property: 'state_name',
  }, {
    title: 'Place Name',
    property: 'place_name',
  }, {
    title: 'Rooms',
    property: 'rooms',
  }, {
    title: 'Price',
    property: 'price_aprox_usd',
  }, {
    property: 'properati_url',
    format: (value) => {
      if (!value) return null;
      return `<a style="width:100%;display:block;text-align:right;font-size:1.3em;text-decoration:none;" target="_blank" href="${value}">ℹ️</a>`;
    },
  }],
  style: category,
  attribution: 'Datos provistos por <a href="https://www.properati.com.ar">Properati</a>',
}));

dashboard.addOverlayLayer(new GeoDashboard.WMSLayer({
  title: 'Heatmap',
  server: server,
  layer: 'geodashboard:properati',
  style: 'geodashboard:heatmap',
  exclusive: true,
  attribution: 'Datos provistos por <a href="https://www.properati.com.ar">Properati</a>',
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Price (USD)',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'price_aprox_usd',
  function: 'Average',
  format: function(value) {
    return `$${parseInt(value)}`;
  },
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Total Surface',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'surface_total_in_m2',
  function: 'Average',
  format: function (value) {
    return `${parseInt(value)} m2`;
  },
}));

dashboard.addWidget(new GeoDashboard.CategoryWidget({
  title: 'Properties by Type',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'property_type',
  categories: property_type,
}));

dashboard.addWidget(new GeoDashboard.CategoryWidget({
  title: 'Properties by Category',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'category',
  categories: category,
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Properties by Type',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'property_type',
  categories: property_type,
  chart: {
    type: 'bar',
  },
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Properties by Category (%)',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'category',
  categories: category,
  chart: {
    type: 'doughnut',
  },
}));

dashboard.render();
