import {sign} from 'jsonwebtoken';
import {ErrorHandler} from '../middlewares/error';
import {applyPaginationBound, IPaginatedResponse, IPaginationParams} from '../models/pagination';
import {IMockUser, IMockUserPublicData} from '../models/user';

// ----------------------------------------
// DEMO ONLY
//
// See disclaimer in app-server/README.md
// ----------------------------------------

interface IMockDB {
  users: { [username: string]: IMockUser };
  activeTokens: { [username: string]: Set<string> };
}

let mockDB: IMockDB;

resetTestDB();

export const
  JWT_SECRET = 'the very $€©®€t demo token which should never be hard coded';


export interface ITokenPayload extends Pick<IMockUser, 'username' | 'role'> {
  tokenId: string;
}

export function resetTestDB() {
  mockDB = {
    users: {
      theAdmin: {username: 'theAdmin', password: 'theAdmin-pwd', role: 'admin', loginAttempts: 0},
      johnDoe: {username: 'johnDoe', password: 'johnDoe-pwd', role: 'user', loginAttempts: 0},
      janeDoe: {username: 'janeDoe', password: 'janeDoe-pwd', role: 'user', enabled: false, loginAttempts: 0},
    },
    activeTokens: {}
  };
}

export function login(username: string, password: string) {
  return new Promise((resolve, reject) => {

    checkAccess(username, password);

    const
      userInDb = mockDB.users[username],
      payload: ITokenPayload = {
        username,
        role: userInDb.role,
        tokenId: getTokenId(username)
      };

    sign(payload, JWT_SECRET, {algorithm: 'HS512', expiresIn: '7d'}, (err, token) => {
      if (err) {
        return reject(new ErrorHandler(500));
      }

      resolve(token);
    });
  });
}

export function logout(username: string, tokenId: string) {
  if (!mockDB.activeTokens[username]) {
    return;
  }

  mockDB.activeTokens[username].delete(tokenId);
}

export function isTokenValid(username: string, tokenId: string) {
  if (!mockDB.activeTokens[username]) {
    return false;
  }

  return mockDB.activeTokens[username].has(tokenId);
}

export function getUserProfile(username: string): IMockUserPublicData {
  const {role, enabled} = mockDB.users[username];
  return {username, role, enabled};
}

export function getAllUsers(params: IPaginationParams): IPaginatedResponse<IMockUserPublicData> {
  const
    boundParams = applyPaginationBound(params),
    users = Object.values(mockDB.users);

  return {
    items: users.slice(boundParams.offset, boundParams.offset + boundParams.limit),
    count: users.length
  };
}

function checkAccess(username: string, password: string) {
  const userInDb = mockDB.users[username];

  if (!userInDb || userInDb.enabled === false) {
    throw new ErrorHandler(401);
  }

  if (userInDb.password !== password) {
    userInDb.loginAttempts++;

    if (userInDb.loginAttempts >= 5) {
      userInDb.enabled = false;
    }

    throw new ErrorHandler(401);
  }
}

/**
 * Login creates a token and generates a random hash to keep track of active tokens.
 * Once the user logs out, the hash in the token is removed from the list of active tokens.
 */
function getTokenId(username: string) {
  const random = Math.random().toString(32);
  mockDB.activeTokens[username] = mockDB.activeTokens[username] || new Set();
  mockDB.activeTokens[username].add(random);
  return random;
}
