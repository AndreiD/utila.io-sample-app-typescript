import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from './auth';
const dotenv = require('dotenv');

dotenv.config();

// The RestClient class provides methods to interact with the Utila API.
export class RestClient {
  private baseURL: string;
  private timeout: number;
  private vaultID: string;

  constructor(timeout: number = 10000) {
    this.baseURL = 'https://api.utila.io'; //hardcoded for now
    this.timeout = timeout; // Default timeout in milliseconds
    this.vaultID = process.env.VAULT_ID;
  }

  //=== HEADERS ===
  private _commonHeaders(
    additionalHeaders?: Record<string, string>
  ): Record<string, string> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${getToken()}`,
    };
    if (additionalHeaders) {
      Object.assign(headers, additionalHeaders);
    }
    return headers;
  }

  //=== GET REQUEST ===
  public async get<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T | null> {
    try {
      const config: AxiosRequestConfig = {
        headers: this._commonHeaders(headers),
        timeout: this.timeout,
      };

      const res: AxiosResponse<T> = await axios.get(
        `${this.baseURL}${endpoint}`,
        config
      );
      return res.data;
    } catch (error: any) {
      console.error(`GET request failed: ${error.message}`);
      if (error.response) {
        console.error(
          `Response content: ${JSON.stringify(error.response.data, null, 2)}`
        );
      }
      return null;
    }
  }

  //=== POST REQUEST ===
  public async post<T>(
    endpoint: string,
    req: any,
    headers?: Record<string, string>
  ): Promise<T | null> {
    try {
      const config: AxiosRequestConfig = {
        headers: {
          ...this._commonHeaders(headers),
          'Content-Type': 'application/json',
        },
        timeout: this.timeout,
      };

      const res: AxiosResponse<T> = await axios.post(
        `${this.baseURL}${endpoint}`,
        req,
        config
      );
      return res.data;
    } catch (error: any) {
      console.error(`POST request failed: ${error.message}`);
      if (error.response) {
        console.error(
          `Response content: ${JSON.stringify(error.response.data, null, 2)}`
        );
      }
      return null;
    }
  }

  // Example method to get vaults
  public async getVaults(): Promise<void> {
    const endpoint = '/v2/vaults';
    const data = await this.get(endpoint);
    console.log(JSON.stringify(data, null, 4));
  }

  // Example list wallets
  public async listWallets(): Promise<void> {
    const endpoint = `/v2/vaults/${this.vaultID}/wallets`;
    const data = await this.get(endpoint);
    console.log(JSON.stringify(data, null, 4));
  }

  // Example initiate asset transfer
  public async initiateAssetTransfer(
    asset: string,
    amount: string,
    sourceAddress: string,
    destinationAddress: string,
    payFeeFromAmount: boolean = false,
    memo?: string
  ): Promise<any | null> {
    const endpoint = `/v2/vaults/${this.vaultID}/transactions:initiate`;
    const payload: Record<string, any> = {
      details: {
        assetTransfer: {
          asset,
          amount,
          sourceAddress,
          destinationAddress,
          payFeeFromAmount,
        },
      },
    };

    if (memo) {
      payload.details.assetTransfer.memo = memo;
    }

    return await this.post(endpoint, payload);
  }
}
