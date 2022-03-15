import { render, screen } from '@testing-library/react'

import { mocked } from 'jest-mock'

import { stripe } from '../../services/stripe'

import Home, { getStaticProps } from '../../pages'

jest.mock('next/router')

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return { data: null, status: 'loading' }
    }
  }
})

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />)

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  })

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({ // whenever the function is a Promise, use this method
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any) 

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})