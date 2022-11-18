import ApiService from './ApiService';
const { APIClient } = ApiService;

const getTokenService = ({ queryKey }: any) => {
  const [_, userId] = queryKey;
  return APIClient.get(`user/${userId}`);
};

export default { getTokenService };
