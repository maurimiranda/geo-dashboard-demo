server = 'https://geoserver.siasar.org/geoserver';
namespace = {
  name: 'siasar',
  url: 'http://siasar.org'
};

const categories = {
  property: 'score',
  values: {
    'A': { color: '#54BA46' },
    'B': { color: '#FFFF39' },
    'C': { color: '#FF9326' },
    'D': { color: '#C92429' },
  },
};

const types = {
  property: 'type_of_supply',
  values: {
    'Acueducto por Bombeo':   { color: '#789074' },
    'Acueducto por Gravedad': { color: '#c7c6aa' },
    'Pozo con Bomba Manual':  { color: '#e3c1ff' },
  },
}

const dashboard = new GeoDashboard.Dashboard({
  container: document.getElementsByClassName('dashboard')[0],
  header: {
    title: 'GeoDashboard Demo',
    logo: './geo-dashboard-white.png',
  },
  map: {
    center: [-84.891, 12.817],
    zoom: 7,
  },
  filters: [new GeoDashboard.Filter({
    property: 'adm_0',
    value: 'Nicaragua'
  })],
});

dashboard.addBaseLayer(new GeoDashboard.OSMLayer({
  visible: true,
}));
dashboard.addBaseLayer(new GeoDashboard.BingLayer({
  key: 'AlMSfR3F4khtlIefjuE_NYpX403LdlGiod36WLn8HlawywtSud-NSgEklCemD5pR',
}));

dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
  title: 'Communities',
  server: server,
  layer: 'siasar:community',
  exclusive: true,
  visible: true,
  popup: [{
    title: 'Name',
    property: 'name',
  },{
    title: 'Location',
    property: 'adm_3',
  },{
    title: 'Population',
    property: 'population',
  }],
  style: categories,
  attribution: '© <a href="http://siasar.org">SIASAR</a>',
}));

dashboard.addOverlayLayer(new GeoDashboard.WMSLayer({
  title: 'Heatmap',
  server: server,
  layer: 'siasar:community',
  style: 'siasar:heatmap',
  exclusive: true,
}));

dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
  title: 'Systems',
  server: server,
  layer: 'siasar:system',
  exclusive: true,
  visible: false,
  popup: [{
    title: 'Name',
    property: 'name',
  },{
    title: 'Location',
    property: 'adm_3',
  },{
    title: 'Supply Type',
    property: 'supply_type',
  }],
  style: categories,
  attribution: '© <a href="http://siasar.org">SIASAR</a>',
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Total Population',
  server: server,
  namespace: namespace,
  layer: 'siasar:community',
  property: 'population',
  function: 'Sum',
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Population',
  server: server,
  namespace: namespace,
  layer: 'siasar:community',
  property: 'population',
  function: 'Average',
  format: function(value) {
    return parseFloat(value).toFixed(2);
  },
}));

dashboard.addWidget(new GeoDashboard.CategoryWidget({
  title: 'Communities by Category',
  server: server,
  namespace: namespace,
  layer: 'siasar:community',
  property: 'siasar_id',
  categories: categories,
}));

dashboard.addWidget(new GeoDashboard.CategoryWidget({
  title: 'Systems by Category',
  server: server,
  namespace: namespace,
  layer: 'siasar:system',
  property: 'siasar_id',
  categories: categories,
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Communities by Category (%)',
  server: server,
  namespace: namespace,
  layer: 'siasar:community',
  property: 'siasar_id',
  categories: categories,
  chart: {
    type: 'doughnut',
  },
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Systems by Category',
  server: server,
  namespace: namespace,
  layer: 'siasar:system',
  property: 'siasar_id',
  categories: categories,
  chart: {
    type: 'bar',
  },
}));

dashboard.render();
