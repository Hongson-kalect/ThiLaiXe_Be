export const parseGGDriverLink = (url: string) => {
  console.log(
    url.replace('/file/d/', '/uc?id=').replace('/view?usp=drive_link', ''),
  );
};
