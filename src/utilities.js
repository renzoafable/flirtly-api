exports.formatUserBody = function(body) {
  const userAttr = [
    'username',
    'password',
    'firstName',
    'middleName',
    'lastName',
    'contactNumber',
    'emailAddress',
    'sex',
    'city',
    'province'
  ];
  
  let formatted = [];
  Object.keys(body).forEach((key, index) => {
    if (userAttr.includes(key) && 
    index===userAttr.indexOf(key))
      formatted.push(body[key]);
    else {
      formatted.push('');
    }
  });

  return formatted;
}

exports.formatQueryParams = function(query, method) {
  query.reduce((field, key, i) => {
    method === 'get'
      ? (field += `x.${key} LIKE :${key}${
          i === query.length - 1 ? '' : ' AND '
        }`)
      : (field += `${key} = :${key}${i === query.length - 1 ? '' : ', '}`);
    return field;
  }, '');
}