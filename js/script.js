'use strict'; {
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

    function generateTags() {

        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {
            const tagsList = article.querySelector(optArticleTagsSelector);
            let html = ' ';
            const articleTags = article.getAttribute('data-tags');
            const articleTagsArray = articleTags.split(' ');

            for (let tag of articleTagsArray) {
                const linkHTML = '<li><a href="#tag-' + tag + '">' + '#' + tag + '</li>';
                html = html + linkHTML;
            }

            tagsList.innerHTML = html;
        }
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

        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {
            const authorList = article.querySelector(optArticleAuthorSelector);
            let html = ' ';
            const articleAuthors = article.getAttribute('data-author');
            const articleAuthorsArray = articleAuthors.split();

            for (let author of articleAuthorsArray) {
                const linkHTML = '<a href="#author-' + author.replace(' ', '').toLowerCase() + '">by ' + author + '</a>';
                html = html + linkHTML;
            }

            authorList.innerHTML = html;
        }
    }

    generateAuthor();

    function authorClickHandler(event) {
        event.preventDefault();

        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        const author = href.replace('#author-', '');
        const activeAuthors = document.querySelectorAll('a.active[href^="' + href + '"]');

        for (let activeAuthor of activeAuthors) {
            activeAuthor.classList.remove('active');
        }

        const authorLinks = document.querySelectorAll('a[href^="' + href + '"]');

        for (let authorLink of authorLinks) {
            authorLink.classList.add('active')
        }
        generateTitleLinks('[data-author~="' + author + '"]');
    }

    function addClickListenersToAuthors() {
        const links = document.querySelectorAll(optArticleAuthorSelector + 'a');
        for (let link of links) {
            link.addEventListener('click', authorClickHandler);
        }
    }

    addClickListenersToAuthors();

}
