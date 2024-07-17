interface SearchEngine {
  name: string;
  scheme: string;
  icon: string;
}

export const SEARCH_ENGINES: SearchEngine[] = [
  {
    name: 'Google',
    scheme: 'https://www.google.com/search?query=@',
    icon: 'iGoogle',
  },
  {
    name: 'Bing',
    scheme: 'https://bing.com/search?q=@',
    icon: 'iMicrosoft',
  },
  {
    name: 'YouTube',
    scheme: 'https://www.youtube.com/results?search_query=@',
    icon: 'iYouTube',
  },
  {
    name: 'GitHub',
    scheme: 'https://github.com/search?q=@',
    icon: 'iGitHub',
  },
];
