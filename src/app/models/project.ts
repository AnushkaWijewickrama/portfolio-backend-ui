export interface Project {
  _id: string;
  title: string;
  description: string;
  image?: string,
  longDescription: string
  projectYear: string
  projectType: string
  imagePath?: any,
  projectLink: string
  techStack?: any,
  role: string
}
