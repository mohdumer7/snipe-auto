'use client';

import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';

const sniperSchema = yup.object({
  userWalletAddress: yup.string().required('Wallet Address is required'),
  buySource: yup
    .string()
    .oneOf(['pumpfun', 'raydium', 'moonshot', 'bluechip', 'any'], 'Invalid buy source')
    .required('Buy Source is required'),
  minLiquidity: yup.number().min(0).required(),
  maxMarketCap: yup.number().min(0).required(),
  excludeScam: yup.boolean().required(),
  takeProfit: yup.number().min(0).required(),
  stopLoss: yup.number().required(),
  trailingStop: yup.boolean().required(),
});

type SniperFormValues = yup.InferType<typeof sniperSchema>;

export default function AiSniperPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SniperFormValues>({
    resolver: yupResolver(sniperSchema),
  });
  const [submissionStatus, setSubmissionStatus] = useState<string>('');

  const onSubmit = async (data: SniperFormValues) => {
    try {
      const response = await axios.post('/api/ai-sniper', data);
      setSubmissionStatus('Configuration saved successfully!');
      console.log('Response:', response.data);
    } catch (error: any) {
      console.error('Error saving configuration:', error);
      setSubmissionStatus('Error saving configuration. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">AI Sniper Configuration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
        <div>
          <label className="block mb-1 font-medium">User Wallet Address</label>
          <input
            type="text"
            {...register('userWalletAddress')}
            placeholder="Your wallet address"
            className="border p-2 w-full rounded"
          />
          {errors.userWalletAddress && (
            <p className="text-red-500 text-sm">{errors.userWalletAddress.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Buy Source</label>
          <select {...register('buySource')} className="border p-2 w-full rounded">
            <option value="pumpfun">Pump.fun</option>
            <option value="raydium">Raydium</option>
            <option value="moonshot">Moonshot</option>
            <option value="bluechip">Bluechip</option>
            <option value="any">Any</option>
          </select>
          {errors.buySource && (
            <p className="text-red-500 text-sm">{errors.buySource.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Minimum Liquidity</label>
          <input
            type="number"
            {...register('minLiquidity', { valueAsNumber: true })}
            placeholder="Minimum liquidity required"
            className="border p-2 w-full rounded"
          />
          {errors.minLiquidity && (
            <p className="text-red-500 text-sm">{errors.minLiquidity.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Maximum Market Cap</label>
          <input
            type="number"
            {...register('maxMarketCap', { valueAsNumber: true })}
            placeholder="Maximum acceptable market cap"
            className="border p-2 w-full rounded"
          />
          {errors.maxMarketCap && (
            <p className="text-red-500 text-sm">{errors.maxMarketCap.message}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('excludeScam')}
            className="mr-2"
          />
          <label className="font-medium">Exclude Scam Tokens</label>
        </div>
        <div>
          <label className="block mb-1 font-medium">Take Profit (e.g., 2 for 2x)</label>
          <input
            type="number"
            {...register('takeProfit', { valueAsNumber: true })}
            placeholder="Take Profit Multiplier"
            className="border p-2 w-full rounded"
          />
          {errors.takeProfit && (
            <p className="text-red-500 text-sm">{errors.takeProfit.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Stop Loss (e.g., -50 for -50%)</label>
          <input
            type="number"
            {...register('stopLoss', { valueAsNumber: true })}
            placeholder="Stop Loss Percentage"
            className="border p-2 w-full rounded"
          />
          {errors.stopLoss && (
            <p className="text-red-500 text-sm">{errors.stopLoss.message}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('trailingStop')}
            className="mr-2"
          />
          <label className="font-medium">Enable Trailing Stop</label>
        </div>
        <Button type="submit">Save Configuration</Button>
      </form>
      {submissionStatus && (
        <div className="mt-4 p-2 border rounded bg-gray-100 text-center">
          {submissionStatus}
        </div>
      )}
    </div>
  );
}
