/* Research interests: shared paper tags, category counts, and filtering. */
(() => {
  const papers = [...document.querySelectorAll('.research-paper')];
  const filters = document.getElementById('research-filters');
  if (!papers.length || !filters) return;

  const topics = [
    ['bureaucratic-politics', 'U.S. Bureaucratic Politics'],
    ['agency-ideology', 'Agency Ideology'],
    ['american-institutions', 'American Institutions'],
    ['information-sharing', 'Information Sharing'],
    ['policy-diffusion', 'Policy Diffusion'],
    ['racial-ethnic-diversity', 'Racial/Ethnic Diversity'],
    ['socioeconomic-inequality', 'Socioeconomic Inequality']
  ];
  const methods = [
    ['causal-inference', 'Causal Inference'],
    ['text-analysis', 'Text Analysis'],
    ['network-analysis', 'Network Analysis'],
    ['regional-analysis', 'Regional Analysis'],
    ['survival-analysis', 'Survival Analysis']
  ];
  const methodDetails = [
    ['staggered-difference-in-differences', 'Staggered Difference-in-Differences']
  ];
  const labels = new Map([['all', 'All'], ['methodology', 'Methodology'], ...topics, ...methods, ...methodDetails]);
  const paperTags = new Map(papers.map(paper => [paper, {
    topics: (paper.dataset.topics || '').split(' ').filter(Boolean),
    methods: (paper.dataset.methods || '').split(' ').filter(Boolean)
  }]));
  const matches = (paper, category) => {
    const tags = paperTags.get(paper);
    if (category === 'all') return true;
    if (category === 'methodology') return tags.methods.length > 0;
    return tags.topics.includes(category) || tags.methods.includes(category);
  };

  let selected = 'all';
  function applyFilter(category) {
    selected = category;
    let visible = 0;
    papers.forEach(paper => {
      paper.hidden = !matches(paper, category);
      if (!paper.hidden) visible += 1;
    });
    document.querySelectorAll('.research-list section.level2').forEach(section => {
      section.hidden = ![...section.querySelectorAll('.research-paper')].some(paper => !paper.hidden);
    });
    document.querySelectorAll('[data-research-filter]').forEach(button => {
      const active = button.dataset.researchFilter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.getElementById('research-filter-status').textContent =
      `${visible} ${visible === 1 ? 'paper' : 'papers'} shown. ${labels.get(category)}.`;
    const empty = document.getElementById('research-empty');
    empty.hidden = visible > 0;
    empty.textContent = `No papers currently tagged ${labels.get(category)}.`;
  }

  function filterButton(category, className, showCount = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.researchFilter = category;
    button.setAttribute('aria-pressed', 'false');
    button.append(document.createTextNode(labels.get(category)));
    if (showCount) {
      const count = document.createElement('span');
      count.className = 'research-category-count';
      count.textContent = ` (${papers.filter(paper => matches(paper, category)).length})`;
      button.append(count);
    }
    button.addEventListener('click', () => applyFilter(selected === category ? 'all' : category));
    return button;
  }

  filters.append(filterButton('all', 'research-filter', true));
  topics.forEach(([category]) => filters.append(filterButton(category, 'research-filter', true)));

  const methodology = document.createElement('div');
  methodology.className = 'research-methodology';
  methodology.append(filterButton('methodology', 'research-filter', true));
  const disclosure = document.createElement('button');
  disclosure.type = 'button';
  disclosure.className = 'research-methods-toggle';
  disclosure.setAttribute('aria-label', 'Show or hide methodology categories');
  disclosure.setAttribute('aria-expanded', 'true');
  disclosure.setAttribute('aria-controls', 'research-methods');
  disclosure.textContent = '⌄';
  const methodList = document.createElement('div');
  methodList.id = 'research-methods';
  methodList.className = 'research-methods';
  methods.forEach(([category]) => methodList.append(filterButton(category, 'research-filter', true)));
  disclosure.addEventListener('click', () => {
    methodList.hidden = !methodList.hidden;
    disclosure.setAttribute('aria-expanded', String(!methodList.hidden));
  });
  methodology.append(disclosure);
  filters.append(methodology, methodList);

  papers.forEach(paper => {
    const panel = paper.querySelector('[id$="-keywords"] .research-panel-content');
    if (!panel) return;
    const keywords = panel.textContent.trim().split(/,\s*/);
    panel.replaceChildren();
    const addGroup = (label, tags, isFilter = false) => {
      const group = document.createElement('div');
      group.className = 'research-tag-group';
      const heading = document.createElement('p');
      heading.className = 'research-tag-label';
      heading.textContent = label;
      const row = document.createElement('div');
      row.className = 'research-tags';
      tags.forEach(tag => {
        if (isFilter) {
          row.append(filterButton(tag, 'research-tag'));
        } else {
          const keyword = document.createElement('span');
          keyword.className = 'research-keyword';
          keyword.textContent = tag;
          row.append(keyword);
        }
      });
      group.append(heading, row);
      panel.append(group);
    };
    const tags = paperTags.get(paper);
    addGroup('Research Interests', tags.topics, true);
    if (tags.methods.length) addGroup('Methodology', tags.methods, true);
    addGroup('Keywords', keywords);
  });

  document.querySelector('.research-interests').hidden = false;
  applyFilter('all');
})();
