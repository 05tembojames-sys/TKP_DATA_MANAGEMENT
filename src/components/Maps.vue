<template>
  <div class="dhis2-maps-app">
    <TopHeader v-if="showHeader" />
    
    <!-- App Toolbar -->
    <div class="maps-toolbar">
      <div class="toolbar-group">
        <button class="toolbar-btn primary" @click="showAddLayerModal = true">
          <span class="icon">➕</span> Add layer
        </button>
      </div>
      <div class="toolbar-divider"></div>
      <div class="toolbar-group">
        <button class="toolbar-btn" @click="openMap">
          <span class="icon">📂</span> Open
        </button>
        <button class="toolbar-btn" @click="saveMap">
          <span class="icon">💾</span> Save
        </button>
        <button class="toolbar-btn" @click="shareMap">
          <span class="icon">↗️</span> Share
        </button>
        <button class="toolbar-btn" @click="downloadMap">
          <span class="icon">⬇️</span> Download
        </button>
      </div>
    </div>

    <div class="maps-workspace">
      <!-- Left Sidebar: Layers -->
      <aside class="layers-panel">
        <div class="panel-header">
          <h3>Layers</h3>
          <button class="icon-btn" title="Layer settings" @click="openLayerSettings">⚙️</button>
        </div>

        <div class="layers-list">
          <!-- Active Layers -->
          <div v-for="layer in layers" :key="layer.id" class="layer-card" :class="{ 'hidden': !layer.visible }">
            <div class="layer-drag-handle">⋮⋮</div>
            <div class="layer-content">
              <div class="layer-header">
                <span class="layer-icon">{{ layer.icon }}</span>
                <span class="layer-name">{{ layer.name }}</span>
              </div>
              <div class="layer-meta" v-if="layer.subtitle">{{ layer.subtitle }}</div>
            </div>
            <div class="layer-actions">
              <button class="action-btn" @click="toggleLayer(layer)" :title="layer.visible ? 'Hide layer' : 'Show layer'">
                {{ layer.visible ? '👁️' : '👁️‍🗨️' }}
              </button>
              <button class="action-btn" title="Edit layer" @click="editLayer(layer)">✏️</button>
              <button class="action-btn" title="More options" @click="layerOptions(layer)">⋮</button>
            </div>
          </div>
        </div>

        <div class="basemap-section">
          <div class="panel-header">
            <h3>Basemap</h3>
          </div>
          <div class="basemap-selector">
            <div class="basemap-option" :class="{ selected: activeBasemap === 'osm' }" @click="changeBasemap('osm')">
              <div class="basemap-preview osm"></div>
              <span>OSM Light</span>
            </div>
            <div class="basemap-option" :class="{ selected: activeBasemap === 'satellite' }" @click="changeBasemap('satellite')">
              <div class="basemap-preview satellite"></div>
              <span>Satellite</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Map Area -->
      <main class="map-canvas">
        <!-- Map Container -->
        <div id="map" class="map-container"></div>

        <!-- Map Controls (Custom Overlay if needed, but Leaflet has its own) -->
        <div class="map-controls-top-left">
          <div class="search-control">
            <span class="search-icon" @click="searchPlace" style="cursor: pointer">🔍</span>
            <input 
              type="text" 
              placeholder="Search for a place" 
              v-model="searchQuery"
              @keyup.enter="searchPlace"
            />
          </div>
        </div>

        <div class="map-controls-top-right">
          <div class="control-group">
            <button class="map-btn" title="Measure" @click="toggleMeasure">📏</button>
            <button class="map-btn" title="Split view" @click="toggleSplitView">✂️</button>
          </div>
        </div>

        <!-- Bottom Timeline -->
        <div class="time-slider-container">
          <button class="play-btn" @click="togglePlayback">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>
          <div class="timeline-track">
            <div class="timeline-bar" :style="{ width: timelineProgress + '%' }"></div>
            <div class="timeline-knob" :style="{ left: timelineProgress + '%' }"></div>
            <div class="timeline-labels">
              <span>Jan 2024</span>
              <span>Dec 2024</span>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add Layer Modal -->
    <div class="modal-backdrop" v-if="showAddLayerModal" @click="showAddLayerModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add new layer</h3>
          <button class="close-btn" @click="showAddLayerModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="layer-types-grid">
            <div class="layer-type-card" v-for="type in layerTypes" :key="type.id" @click="addLayer(type)">
              <div class="type-icon">{{ type.icon }}</div>
              <div class="type-info">
                <h4>{{ type.name }}</h4>
                <p>{{ type.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopHeader from "./TopHeader.vue";
import { ref, onMounted, watch } from "vue";
import { useToast } from "../composables/useToast.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true
  }
});

const toast = useToast();
const showAddLayerModal = ref(false);
const activeBasemap = ref('osm');
const isPlaying = ref(false);
const timelineProgress = ref(100);
const searchQuery = ref("");
let map = null;
let tileLayer = null;
let layerGroups = {};

// Data
const facilitiesData = [
  { name: 'Lusaka Main Center', lat: -15.4167, lng: 28.2833, type: 'center' },
  { name: 'Chongwe Outreach', lat: -15.3300, lng: 28.6800, type: 'outreach' },
  { name: 'Kafue Center', lat: -15.7667, lng: 28.1833, type: 'center' }
];

const referralsData = [
  { count: 12, lat: -15.4500, lng: 28.3000 },
  { count: 45, lat: -15.3500, lng: 28.6500 },
  { count: 8, lat: -15.7800, lng: 28.2000 }
];

const householdsData = [
  { lat: -15.4200, lng: 28.2900 },
  { lat: -15.4300, lng: 28.2700 },
  { lat: -15.3400, lng: 28.6700 },
  { lat: -15.7700, lng: 28.1900 }
];

const layers = ref([
  { 
    id: 1, 
    name: 'Facilities', 
    subtitle: 'TKP Centers & Outreach',
    icon: '🏥', 
    visible: true 
  },
  { 
    id: 2, 
    name: 'Referrals', 
    subtitle: 'Initial Referrals by Location',
    icon: '📍', 
    visible: true 
  },
  { 
    id: 3, 
    name: 'Vulnerable Households', 
    subtitle: 'Identified Households',
    icon: '🏠', 
    visible: false 
  }
]);

const layerTypes = [
  { id: 'referrals', name: 'Referrals', icon: '📍', description: 'Map initial referrals and case origins' },
  { id: 'assessments', name: 'Assessments', icon: '📝', description: 'Locations of conducted assessments' },
  { id: 'facilities', name: 'Facilities', icon: '🏥', description: 'TKP Centers and Outreach Posts' },
  { id: 'households', name: 'Households', icon: '🏠', description: 'Registered vulnerable households' },
  { id: 'boundaries', name: 'Boundaries', icon: '🗺️', description: 'District and catchment area boundaries' }
];

onMounted(() => {
  initMap();
});

const initMap = () => {
  // Initialize map centered on Lusaka, Zambia
  map = L.map('map').setView([-15.4167, 28.2833], 10);

  // Add default basemap
  addBasemap('osm');

  // Initialize layer groups
  layerGroups['Facilities'] = L.layerGroup().addTo(map);
  layerGroups['Referrals'] = L.layerGroup().addTo(map);
  layerGroups['Vulnerable Households'] = L.layerGroup().addTo(map);

  // Load initial data
  updateLayers();
};

const addBasemap = (type) => {
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  if (type === 'osm') {
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  } else if (type === 'satellite') {
    // Using Esri World Imagery for satellite view
    tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);
  }
};

const changeBasemap = (type) => {
  activeBasemap.value = type;
  addBasemap(type);
};

const updateLayers = () => {
  // Clear all layers first
  Object.values(layerGroups).forEach(group => group.clearLayers());

  // Facilities Layer
  if (isLayerVisible('Facilities')) {
    facilitiesData.forEach(facility => {
      const color = facility.type === 'center' ? '#2b6693' : '#10b981';
      const marker = L.circleMarker([facility.lat, facility.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`<b>${facility.name}</b><br>${facility.type}`);
      layerGroups['Facilities'].addLayer(marker);
    });
  }

  // Referrals Layer (Clusters)
  if (isLayerVisible('Referrals')) {
    referralsData.forEach(ref => {
      const size = ref.count > 20 ? 20 : 15;
      const marker = L.circleMarker([ref.lat, ref.lng], {
        radius: size,
        fillColor: '#e74c3c',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).bindTooltip(ref.count.toString(), { permanent: true, direction: 'center', className: 'cluster-label' });
      layerGroups['Referrals'].addLayer(marker);
    });
  }

  // Households Layer
  if (isLayerVisible('Vulnerable Households')) {
    householdsData.forEach(hh => {
      const marker = L.circleMarker([hh.lat, hh.lng], {
        radius: 4,
        fillColor: '#e67e22',
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
      layerGroups['Vulnerable Households'].addLayer(marker);
    });
  }
};

const toggleLayer = (layer) => {
  layer.visible = !layer.visible;
  updateLayers();
};

const isLayerVisible = (layerName) => {
  const layer = layers.value.find(l => l.name === layerName);
  return layer ? layer.visible : false;
};

const addLayer = (type) => {
  const existing = layers.value.find(l => l.name === type.name);
  if (!existing) {
    layers.value.unshift({
      id: Date.now(),
      name: type.name,
      subtitle: type.description,
      icon: type.icon,
      visible: true
    });
    // Initialize layer group if new
    if (!layerGroups[type.name]) {
      layerGroups[type.name] = L.layerGroup().addTo(map);
    }
  } else {
    existing.visible = true;
  }
  updateLayers();
  showAddLayerModal.value = false;
};

const togglePlayback = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    simulatePlayback();
  }
};

const simulatePlayback = () => {
  if (!isPlaying.value) return;
  timelineProgress.value = (timelineProgress.value + 1) % 100;
  requestAnimationFrame(simulatePlayback);
};

const searchPlace = async () => {
  if (!searchQuery.value) return;

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      
      map.flyTo([lat, lon], 13);
      
      L.popup()
        .setLatLng([lat, lon])
        .setContent(result.display_name)
        .openOn(map);
    } else {
      alert('Place not found');
    }
  } catch (error) {
    console.error('Search error:', error);
    toast.error('An error occurred while searching');
  }
};

// Toolbar Actions
const openMap = () => {
  const savedState = localStorage.getItem('dhis2_map_state');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      map.setView(state.center, state.zoom);
      activeBasemap.value = state.basemap;
      addBasemap(state.basemap);
      
      // Restore layers
      layers.value.forEach(layer => {
        const savedLayer = state.layers.find(l => l.name === layer.name);
        if (savedLayer) {
          layer.visible = savedLayer.visible;
        }
      });
      updateLayers();
      toast.success('Map state restored');
    } catch (e) {
      console.error('Error restoring map:', e);
      toast.error('Failed to load saved map');
    }
  } else {
    toast.info('No saved map found');
  }
};

const saveMap = () => {
  const state = {
    center: map.getCenter(),
    zoom: map.getZoom(),
    basemap: activeBasemap.value,
    layers: layers.value.map(l => ({ name: l.name, visible: l.visible }))
  };
  
  localStorage.setItem('dhis2_map_state', JSON.stringify(state));
  toast.success('Map configuration saved');
};

const shareMap = () => {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const shareText = `TKP Map View: Lat ${center.lat.toFixed(4)}, Lng ${center.lng.toFixed(4)}, Zoom ${zoom}`;
  
  navigator.clipboard.writeText(shareText).then(() => {
    toast.success('Map location copied to clipboard');
  }).catch(() => {
    toast.error('Failed to copy to clipboard');
  });
};

const downloadMap = () => {
  const state = {
    center: map.getCenter(),
    zoom: map.getZoom(),
    basemap: activeBasemap.value,
    layers: layers.value.map(l => ({ name: l.name, visible: l.visible })),
    timestamp: new Date().toISOString()
  };
  
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "tkp_map_config.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  
  toast.success('Map configuration downloaded');
};

// Map Controls
const isMeasuring = ref(false);
let measurePoints = [];
let measureLine = null;
let measureTooltip = null;

const toggleMeasure = () => {
  isMeasuring.value = !isMeasuring.value;
  
  if (isMeasuring.value) {
    toast.info('Measure tool active: Click on the map to start measuring');
    map.getContainer().style.cursor = 'crosshair';
    
    map.on('click', onMeasureClick);
  } else {
    disableMeasure();
  }
};

const disableMeasure = () => {
  isMeasuring.value = false;
  map.getContainer().style.cursor = '';
  map.off('click', onMeasureClick);
  
  // Clear measurements
  if (measureLine) map.removeLayer(measureLine);
  if (measureTooltip) map.removeLayer(measureTooltip);
  measurePoints.forEach(p => map.removeLayer(p));
  measurePoints = [];
  measureLine = null;
  measureTooltip = null;
  
  toast.info('Measure tool deactivated');
};

const onMeasureClick = (e) => {
  const latlng = e.latlng;
  
  // Add point marker
  const point = L.circleMarker(latlng, {
    radius: 4,
    color: '#2b6693',
    fillColor: '#fff',
    fillOpacity: 1
  }).addTo(map);
  
  measurePoints.push(point);
  
  if (measurePoints.length > 1) {
    // Draw line
    const points = measurePoints.map(p => p.getLatLng());
    
    if (measureLine) map.removeLayer(measureLine);
    
    measureLine = L.polyline(points, {
      color: '#2b6693',
      weight: 3,
      dashArray: '5, 10'
    }).addTo(map);
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += points[i].distanceTo(points[i+1]);
    }
    
    // Show tooltip
    const distanceText = totalDistance > 1000 
      ? `${(totalDistance / 1000).toFixed(2)} km` 
      : `${Math.round(totalDistance)} m`;
      
    if (measureTooltip) map.removeLayer(measureTooltip);
    
    measureTooltip = L.tooltip({
      permanent: true,
      direction: 'right',
      className: 'measure-tooltip'
    })
    .setLatLng(latlng)
    .setContent(`Total: ${distanceText}`)
    .addTo(map);
  }
};

const toggleSplitView = () => {
  // Mock split view for now as it requires complex DOM manipulation or a plugin
  const mapContainer = document.getElementById('map');
  if (mapContainer.style.borderRight) {
    mapContainer.style.width = '100%';
    mapContainer.style.borderRight = 'none';
    toast.info('Split view disabled');
  } else {
    mapContainer.style.width = '50%';
    mapContainer.style.borderRight = '2px solid #2b6693';
    toast.info('Split view enabled (Mock: Map width reduced)');
  }
  map.invalidateSize();
};

// Layer Actions
const editLayer = (layer) => {
  // Mock edit: prompt for new name
  const newName = prompt(`Rename layer "${layer.name}":`, layer.name);
  if (newName && newName !== layer.name) {
    layer.name = newName;
    toast.success(`Layer renamed to ${newName}`);
  }
};

const layerOptions = (layer) => {
  // Toggle opacity as a demo option
  const group = layerGroups[layer.name];
  if (group) {
    group.eachLayer(l => {
      if (l.options.opacity === 0.5) {
        l.setOpacity(1);
        if (l.setStyle) l.setStyle({ fillOpacity: 0.8 });
      } else {
        l.setOpacity(0.5);
        if (l.setStyle) l.setStyle({ fillOpacity: 0.4 });
      }
    });
    toast.info(`Toggled opacity for ${layer.name}`);
  }
};

const openLayerSettings = () => {
  alert('Global Map Settings:\n- Projection: Mercator\n- Units: Metric\n- Grid: Off');
};
</script>

<style scoped>
.dhis2-maps-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f5f7;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  color: #212121;
}

/* Toolbar */
.maps-toolbar {
  height: 48px;
  background: white;
  border-bottom: 1px solid #d5d5d5;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  z-index: 10;
}

.toolbar-group {
  display: flex;
  gap: 8px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #d5d5d5;
  margin: 0 4px;
}

.toolbar-btn {
  height: 32px;
  padding: 0 12px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #494949;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f3f5f7;
}

.toolbar-btn.primary {
  background: #2b6693;
  color: white;
}

.toolbar-btn.primary:hover {
  background: #1d4260;
}

.toolbar-btn .icon {
  font-size: 1rem;
}

/* Workspace */
.maps-workspace {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Layers Panel */
.layers-panel {
  width: 300px;
  background: white;
  border-right: 1px solid #d5d5d5;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 5;
}

.panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #212121;
  text-transform: uppercase;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #757575;
  font-size: 1rem;
}

.layers-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  background: #f8f9fa;
}

.layer-card {
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  padding: 8px;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.layer-card.hidden {
  opacity: 0.6;
  background: #f9f9f9;
}

.layer-drag-handle {
  color: #bdbdbd;
  cursor: grab;
  padding: 0 8px;
  font-size: 1.2rem;
}

.layer-content {
  flex: 1;
  padding: 0 8px;
}

.layer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.layer-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #212121;
}

.layer-meta {
  font-size: 0.75rem;
  color: #757575;
}

.layer-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #757575;
  border-radius: 3px;
}

.action-btn:hover {
  background: #eee;
  color: #212121;
}

/* Basemap */
.basemap-section {
  border-top: 1px solid #d5d5d5;
  background: white;
}

.basemap-selector {
  padding: 12px;
  display: flex;
  gap: 12px;
}

.basemap-option {
  cursor: pointer;
  text-align: center;
}

.basemap-preview {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 2px solid transparent;
  margin-bottom: 4px;
  background-size: cover;
}

.basemap-preview.osm {
  background-color: #e0e0e0;
  background-image: radial-gradient(#ccc 1px, transparent 1px);
  background-size: 10px 10px;
}

.basemap-preview.satellite {
  background-color: #333;
  background-image: radial-gradient(#555 1px, transparent 1px);
  background-size: 10px 10px;
}

.basemap-option.selected .basemap-preview {
  border-color: #2b6693;
}

.basemap-option span {
  font-size: 0.75rem;
  color: #616161;
}

/* Map Canvas */
.map-canvas {
  flex: 1;
  position: relative;
  background: #e5e7eb;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Map Controls */
.map-controls-top-left {
  position: absolute;
  top: 16px;
  left: 50px; /* Adjusted for Leaflet zoom controls */
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
}

.search-control {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 40px;
  width: 280px;
}

.search-icon {
  color: #757575;
  margin-right: 8px;
}

.search-control input {
  border: none;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
}

.map-controls-top-right {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1000;
}

.control-group {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  display: flex;
}

.map-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  border-right: 1px solid #eee;
}

.map-btn:last-child {
  border-right: none;
}

.map-btn:hover {
  background: #f5f5f5;
}

/* Timeline */
.time-slider-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: white;
  border-top: 1px solid #d5d5d5;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  z-index: 1000;
}

.play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2b6693;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-track {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  position: relative;
}

.timeline-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #90caf9;
  border-radius: 2px;
}

.timeline-knob {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: #2b6693;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.timeline-labels {
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #757575;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  width: 600px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #212121;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #757575;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.layer-types-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.layer-type-card {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.layer-type-card:hover {
  border-color: #2b6693;
  background: #f0f7fc;
}

.type-icon {
  font-size: 2rem;
}

.type-info h4 {
  margin: 0 0 4px 0;
  color: #212121;
  font-size: 1rem;
}

.type-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #757575;
}

/* Leaflet Overrides for Cluster Labels */
:deep(.cluster-label) {
  background: transparent;
  border: none;
  box-shadow: none;
  color: white;
  font-weight: bold;
  font-size: 12px;
}

@media (max-width: 768px) {
  .maps-toolbar {
    height: auto;
    flex-wrap: wrap;
    padding: 8px;
    gap: 8px;
  }

  .toolbar-group {
    flex-wrap: wrap;
  }

  .maps-workspace {
    flex-direction: column;
  }

  .layers-panel {
    width: 100%;
    height: auto;
    max-height: 30vh;
    border-right: none;
    border-bottom: 1px solid #d5d5d5;
    display: none; /* Hide layers on mobile by default */
  }

  .map-canvas {
    height: 60vh;
  }

  .map-controls-top-left {
    left: 10px;
    right: 10px;
    width: auto;
  }

  .search-control {
    width: 100%;
  }

  .layer-types-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
