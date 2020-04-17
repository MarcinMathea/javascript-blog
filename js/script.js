/* eslint-disable*/
/* eslint-disable no-prototype-builtins */
/* eslint-disable linebreak-style */
/* eslint-disable linebreak-style */
'use strict';
{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
  };

  const optArticleSelector = '.post';
  const optTitleSelector = '.post-title';
  const optTitleListSelector = '.titles';
  const optArticleTagsSelector = '.post-tags .list';
  const optArticleAuthorSelector = '.post-author';
  const optCloudClassCount = 5;

  function titleClickHandler (event) {
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

  function calculateAuthorsParams (authors) {
    const params = {
      max: 0,
      min: 999999
    };
  
    for (let author in authors) {
      params.max = Math.max(authors[author], params.max);
      params.min = Math.min(authors[author], params.min);
    }
    return params;
  };

  function calculateAuthorClass (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

    return classNumber;
  };

  function calculateTagsParams (tags) {
    const params = {
      max: 0,
      min: 999999
    };
  
    for (let tag in tags) {
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }
    return params;
  };
  
  function calculateTagClass (count, params) { 
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  
    return classNumber;
  };

  function generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(optTitleListSelector);

    titleList.innerHTML = '';
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';
    for (let article of articles) {
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);
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
    let allTags = {};
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles) {
      const tagsList = article.querySelector(optArticleTagsSelector);
      let html = ' ';
      const articleTags = article.getAttribute('data-tags');
      const articleTagsArray = articleTags.split(' ');

      for (let tag of articleTagsArray) {
        const linkHTMLData = { id: tag, title: tag };
        const linkHTML = templates.tagLink(linkHTMLData);
        html = html + linkHTML;
        if (!allTags.hasOwnProperty(tag)) {
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      }
      tagsList.innerHTML = html;
    }
    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = { tags: [] };

    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
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
      tagLink.classList.add('active');
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
      const articleAuthorSelect = article.querySelector(optArticleAuthorSelector);
      let html = '';
      const articleAuthors = article.getAttribute('data-author');
      const linkHTMLData = { id: articleAuthors, title: articleAuthors };
      const linkHTML = templates.authorLink(linkHTMLData);

      html = html + linkHTML;

      if (!allAuthors.hasOwnProperty(articleAuthors)) {
        allAuthors[articleAuthors] = 1;
      } else {
        allAuthors[articleAuthors]++;
      }

      articleAuthorSelect.innerHTML = html;
    }

    const authorCloudList = document.querySelector('.authors');
    const authorParams = calculateAuthorsParams(allAuthors);
    let allAuthorsData = { authors: [] };

    for (let allAuthor in allAuthors) {
      allAuthorsData.authors.push({
        author: allAuthor,
        count: allAuthors[allAuthor],
        className: calculateAuthorClass(allAuthors[allAuthor], authorParams)
      });
    }

    authorCloudList.innerHTML = templates.authorCloudLink(allAuthorsData);
  };

  generateAuthor();

  function authorClickHandler(event) {
    event.preventDefault();

    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const authorActive = document.querySelectorAll('a.active[href^="#author-"]');

    for (let activeAuthor of authorActive) {
      activeAuthor.classList.remove('active');
    }

    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

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
