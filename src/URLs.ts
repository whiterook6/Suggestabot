const cleanURLRegex = /\/int_[a-f0-9]+/g;

export const cleanURL = (url: string): string => {
  return url.trim().replace(cleanURLRegex, "");
}

const getTypeRegex = /http:\/\/dbtropes\.org\/resource\/([a-zA-Z]+)/;
export const getMediaType = (url: string): string | null => {
  const match = url.match(getTypeRegex);
  if (!match || match.length < 2){
    return null;
  }

  return match[1];
}

const getNameFromURLRegex = /http:\/\/dbtropes.org\/resource\/Main\/([^\/]+)/
export const getTropeNameFromURL = (url: string) => {
  const match = url.match(getNameFromURLRegex);
  if (!match || match.length < 2){
    return null;
  }

  return match[1];
}