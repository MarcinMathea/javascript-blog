'use strict';
{
    const titleClickHandler = function(event) {
        event.preventDefault();
        const clickedElement = this;
        const activeLinks = document.querySelectorAll('.titles a.active');
        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }
        clickedElement.classList.add('active');
        const activeArticles = document.querySelectorAll('.posts article.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }
        const articleSelector = clickedElement.getAttribute('href');
        const targetArticle = document.querySelector(articleSelector);
        targetArticle.classList.add('active');
    }
    const optArticleSelector = '.post';
    const optTitleSelector = '.post-title';
    const optTitleListSelector = '.titles';
    const optArticleTagsSelector = '.post-tags .list';
    const optArticleAuthorSelector = '.post-author';
    const optAuthorsListSelector = '.authors';
    const optCloudClassPrefix = 'tag-size-';
    const optCloudClassCount = 5;

    function generateTitleLinks(customSelector = '') {
        const titleList = document.querySelector(optTitleListSelector);

        titleList.innerHTML = '';
        const articles = document.querySelectorAll(optArticleSelector + customSelector);

        let html = '';
        for (let article of articles) {
            const articleId = article.getAttribute('id');
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            html = html + linkHTML;
        }
        titleList.innerHTML = html;
        const links = document.querySelectorAll('.titles a');
        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }
    }
    generateTitleLinks();

    function calculateTagsParams(tags){
      const params = {
        max: 0,
        min: 999999
      }
      for(let tag in tags){
        params.max = Math.max(tags[tag], params.max);
        params.min = Math.min(tags[tag], params.min);
      }
      return params;
  }

    function calculateTagClass(count, params) {
      const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * optCloudClassCount + 1 );
      return optCloudClassPrefix + classNumber;
    }

    function generateTags() {
        let allTags = {};
        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {
            const tagsList = article.querySelector(optArticleTagsSelector);
            let html = ' ';
            const articleTags = article.getAttribute('data-tags');
            const articleTagsArray = articleTags.split(' ');

            for (let tag of articleTagsArray) {
                const linkHTML = '<li><a href="#tag-' + tag + '">' + '#' + tag + '</li>';
                html = html + linkHTML;
                if(!allTags.hasOwnProperty(tag)){
                  allTags[tag] = 1;
                } else {
                  allTags[tag]++;
                }
            }
            tagsList.innerHTML = html;
        }
        const tagList = document.querySelector('.tags');
        const tagsParams = calculateTagsParams(allTags);
        console.log('tagsParams:', tagsParams);
        let allTagsHTML = '';

        for(let tag in allTags){
          allTagsHTML += '<li><a href="#' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</></li>';
        }
        tagList.innerHTML = allTagsHTML;
    }

    generateTags();

    function tagClickHandler(event) {
        event.preventDefault();

        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        const tag = href.replace('#tag-', '');
        const activeTags = document.querySelectorAll('a.active[href^="' + href + '"]');

        for (let activeTag of activeTags) {
            activeTag.classList.remove('active');
        }

        const tagLinks = document.querySelectorAll('a[href^="' + href + '"]');

        for (let tagLink of tagLinks) {
            tagLink.classList.add('active')
        }
        generateTitleLinks('[data-tags~="' + tag + '"]');
    }

    function addClickListenersToTags() {
        const links = document.querySelectorAll('.post-tags .list li a');
        for (let link of links) {
            link.addEventListener('click', tagClickHandler);
        }
    }

    addClickListenersToTags();

    function generateAuthor() {
        let allAuthors = {};
        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {
            let html = ' ';
            const articleAuthors = article.getAttribute('data-author');
            const articleAuthorsArray = articleAuthors.split();

            for (let author of articleAuthorsArray) {
                const linkHTML = '<a href="#author-' + author.replace(' ', '-') + '">by ' + author + '</a>';
                html = html + linkHTML;
                if(!allAuthors.hasOwnProperty(author)){
                  allAuthors[author] = 1;
                } else {
                  allAuthors[author]++;
                }
            }
            const authorList = document.querySelector(optAuthorsListSelector);
            const tagsParams = calculateTagsParams(allAuthors);
            console.log('authorsParams:', tagsParams);
            let allAuthorsHTML = '';

            for(let author in allAuthors){
              allAuthorsHTML += '<li><a href="#' + author + '" class="' + calculateTagClass(allAuthors[author], tagsParams) + '">' + author + '</></li>';
            }
            authorList.innerHTML = allAuthorsHTML;
        }
    }

    generateAuthor();

    function authorClickHandler(event) {
        event.preventDefault();

        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        const author = href.replace('#author-', '').replace('-', ' ');
        const activeAuthors = document.querySelectorAll('a.active[href^="' + href + '"]');

        for (let activeAuthor of activeAuthors) {
            activeAuthor.classList.remove('active');
        }

        const authorLinks = document.querySelectorAll('a[href^="' + href + '"]');

        for (let authorLink of authorLinks) {
            authorLink.classList.add('active');
        }
        generateTitleLinks('[data-author="' + author + '"]');

    }

    function addClickListenersToAuthors() {
        const links = document.querySelectorAll(optArticleAuthorSelector + ' a');
        for (let link of links) {
            link.addEventListener('click', authorClickHandler);
        }
    }

    addClickListenersToAuthors();
}
