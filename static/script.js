var maxVisiblePages = 11; // Maximum number of visible page links
var startPage = 0;
var endPage = maxVisiblePages - 1;

function filterTable() {
    var table = document.getElementById('data-table');
    var rows = table.getElementsByTagName('tr');
    var pageSize = parseInt(document.getElementById('page-size-select').value);

    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var rowVisible = true;
        for (var j = 0; j < row.cells.length; j++) {
            var cell = row.cells[j];
            var input = document.getElementById('input-' + j);
            var regex = new RegExp(input.value, 'i');
            if (!cell.innerHTML.match(regex)) {
                rowVisible = false;
                break;
            }
        }
        if (rowVisible) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
    var pageLinks = document.getElementsByClassName('page-link');
    var pageLinksContainer = document.getElementById('page-links');
    while (pageLinksContainer.firstChild) {
        pageLinksContainer.removeChild(pageLinksContainer.firstChild);
    }
    var visibleRows = table.querySelectorAll('tbody tr:not([style*="display: none"])');
    document.getElementById('results').innerHTML = visibleRows.length;

    var numPages = Math.ceil(visibleRows.length / pageSize);
    for (var i = 0; i < numPages; i++) {
        var link = document.createElement('a');
        link.href = '#';
        link.textContent = i + 1;
        link.classList.add('page-link');
        link.onclick = function (event) {
            event.preventDefault();
            var pageNum = parseInt(this.textContent);
            var startIndex = (pageNum - 1) * pageSize;
            var endIndex = Math.min(pageNum * pageSize, visibleRows.length);
            for (var j = 0; j < visibleRows.length; j++) {
                if (j >= startIndex && j < endIndex) {
                    visibleRows[j].style.display = '';
                } else {
                    visibleRows[j].style.display = 'none';
                }
            }
            updatePageLinkClasses(this);
        };
        pageLinksContainer.appendChild(link);
    }
    updatePageLinkClasses(pageLinksContainer.querySelector('.page-link'));

    function updatePageLinkClasses(activeLink) {
        for (var i = 0; i < pageLinks.length; i++) {
            var link = pageLinks[i];
            if (link === activeLink) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    }
    pageLinksContainer.querySelector('.page-link').click(); //click on the first page
    document.getElementById('total_pages').innerHTML = pageLinks.length;
    var pageLinks = document.getElementsByClassName('page-link');
    updatePagesLinks(startPage, endPage, pageLinks);
}

function changePageSize(size) {
    var pageLinks = document.getElementsByClassName('page-link');
    var table = document.getElementById('data-table');
    var visibleRows = table.querySelectorAll('tbody tr:not([style*="display: none"])');
    document.getElementById('results').innerHTML = visibleRows.length;


    for (var i = 0; i < pageLinks.length; i++) {
        pageLinks[i].classList.remove('active');
    }
    var header = table.getElementsByTagName('thead')[0];
    var body = table.getElementsByTagName('tbody')[0];
    var rows = body.getElementsByTagName('tr');
    var numPages = Math.ceil(rows.length / size);
    for (var i = 0; i < numPages; i++) {
        var link = document.createElement('a');
        link.href = '#';
        link.textContent = i + 1;
        link.classList.add('page-link');
        link.onclick = function () {
            var pageNum = parseInt(this.textContent);
            var startIndex = (pageNum - 1) * size;
            var endIndex = Math.min(pageNum * size, rows.length);
            for (var j = 0; j < rows.length; j++) {
                if (j >= startIndex && j < endIndex) {
                    rows[j].style.display = '';
                } else {
                    rows[j].style.display = 'none';
                }
            }
            for (var j = 0; j < pageLinks.length; j++) {
                pageLinks[j].classList.remove('active');
            }
            this.classList.add('active');
            header.style.display = '';
        }
        document.getElementById('page-links').appendChild(link);
    }
    var firstLink = document.getElementsByClassName('page-link')[0];
    if (firstLink) {
        firstLink.click();
    }
    var pageLinksContainer = document.getElementById('page-links');
    var pageLinks = pageLinksContainer.getElementsByClassName('page-link');
    document.getElementById('total_pages').innerHTML = pageLinks.length;

}

document.addEventListener('DOMContentLoaded', function () {
    changePageSize(document.getElementById('min_rows').value);
    document.getElementById('page-size-select').addEventListener('change', function () {
        var size = parseInt(this.value);
        var pageLinksContainer = document.getElementById('page-links');
        while (pageLinksContainer.firstChild) {
            pageLinksContainer.removeChild(pageLinksContainer.firstChild);
        }
        changePageSize(size);
    });
    var previousButton = document.getElementById('previous-page');
    var nextButton = document.getElementById('next-page');

    // Add event listeners to the buttons
    previousButton.addEventListener('click', function () {
        navigatePage('previous');
    });

    nextButton.addEventListener('click', function () {
        navigatePage('next');
    });
    var pageLinks = document.getElementsByClassName('page-link');
    updatePagesLinks(startPage, endPage, pageLinks);

    var pageLinksContainer = document.getElementById('page-links');
    var pageLinks = pageLinksContainer.getElementsByClassName('page-link');
    document.getElementById('total_pages').innerHTML = pageLinks.length;

});

function navigatePage(direction) {
    var pageLinksContainer = document.getElementById('page-links');
    var pageLinks = pageLinksContainer.getElementsByClassName('page-link');
    var activeIndex = parseInt(pageLinksContainer.querySelector('.active').textContent) - 1;
    var numPages = pageLinks.length;


    console.log(pageLinks)
    if (direction === 'previous' && activeIndex > 0) {
      pageLinks[activeIndex - 1].click();
    } else if (direction === 'next' && activeIndex < numPages - 1) {
      pageLinks[activeIndex + 1].click();
    }
  
    if (activeIndex >= endPage && direction === 'next') {
      startPage++;
      endPage++;
      updatePagesLinks(startPage, endPage, pageLinks);
    } else if (activeIndex < startPage && direction === 'previous') {
      startPage--;
      endPage--;
      updatePagesLinks(startPage, endPage, pageLinks);
      pageLinks[startPage].click();

    }
    console.log("activeIndex=",activeIndex,"startPage=",startPage,"endPage=",endPage)
  }

function updatePagesLinks(startPage, endPage, pageLinks) {
    console.log("updatePagesLinks");

    var numPages = pageLinks.length;
    for (var i = 0; i < numPages; i++) {
        var page = pageLinks[i];
        if (i >= startPage && i <= endPage) {
            page.style.display = '';
        } else {
            page.style.display = 'none';
        }
    }
}
