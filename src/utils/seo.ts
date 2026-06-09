import { profile } from '../data/profile';

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
};

export function buildSeo({ title, description, path = '/' }: SeoInput = {}) {
  const pageTitle = title ? `${title} | ${profile.name}` : `${profile.name} - ${profile.title}`;
  const url = new URL(path, profile.site).toString();

  return {
    title: pageTitle,
    description: description ?? profile.intro,
    url,
  };
}
