

export const ValidateProfileData = (body) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'age', 'gender', 'about', 'address', 'profilePic'];
  const isEditAllowed = Object.keys(body).every((key) => allowedFields.includes(key));
  return isEditAllowed;
};
