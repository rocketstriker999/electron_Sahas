import { requestHelper } from './helper.js';


let CheckoutDemosHandler = {};

CheckoutDemosHandler.videosTab = document.getElementById('videosTab');
CheckoutDemosHandler.pdfsTab = document.getElementById('pdfsTab');
CheckoutDemosHandler.audiosTab = document.getElementById('audiosTab');


CheckoutDemosHandler.videosTab.addEventListener("click", (e) => {
  openTab('videos');
});
CheckoutDemosHandler.pdfsTab.addEventListener("click", (e) => {
  openTab('pdfs');
});
CheckoutDemosHandler.audiosTab.addEventListener("click", (e) => {
  openTab('audios');
});


function openTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
      tab.className = 'tab';
      if (tab.id == `${tabName}Tab`) {
          tab.className = 'tab tab-active';
      }
  });

  tabContents.forEach(content => {
      content.className = 'tab-content';
      if (content.id == tabName) {
          content.className = 'tab-content tab-content-active';
      }
  });
}
