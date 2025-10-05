// This describes the access token Shopify returns
export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

// This describes error objects from Shopify
export interface CustomerUserError {
  code: string
  field: string[] | null
  message: string
}

// This describes a Shopify customer
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

// This describes customer data returned from queries
export interface CustomerData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  acceptsMarketing: boolean
}

/**
 * Login customer and get access token
 */
export async function loginCustomer(
  email: string,
  password: string
): Promise<{
  success: boolean
  accessToken?: CustomerAccessToken
  errors?: string[]
}> {
  // Step 1: Define the GraphQL mutation
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    } 
  `
  // Step 2: Prepare the variables (email and password)
  const variables = {
    input: {
      email,
      password,
    },
  }
    // Step 3: Send to Shopify and handle response
  try {
    const { shopifyFetch } = await import("./shopify")
    const data = await shopifyFetch(mutation, variables)

    // Step 4: Check if there are errors
    if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: data.customerAccessTokenCreate.customerUserErrors.map(
          (error: any) => error.message
        ),
      }
    }
    // Step 5: Return the access token
    return {
      success: true,
      accessToken: data.customerAccessTokenCreate.customerAccessToken,
    }
  } catch(error) {
    console.error("Login customer failed:", error)
    return {
      success: false,
      errors: ["Login failed. Please check your credentials"],
    }
  }
}

/**
 * Logout customer and invalidate access token
 */
export async function logoutCustomer(
  accessToken: string
): Promise<{
  success: boolean
  errors?: string[]
}> {
  // Step 1: Define the GraphQL mutation
  const mutation = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }
  `
  // Step 2: Prepare the variables (access token)
  const variables = {
    customerAccessToken: accessToken,
  }
  // Step 3: Send to Shopify and handle response
  try {
    const { shopifyFetch } = await import("./shopify")
    const data = await shopifyFetch(mutation, variables)

    // Step 4: Check if there are errors
    if (data.customerAccessTokenDelete.userErrors.length > 0) {
      return {
        success: false,
        errors: data.customerAccessTokenDelete.userErrors.map(
          (error: any) => error.message
        ),
      }
    }
    // Step 5: Return success
    return {
      success: true,
    }
  } catch(error) {
    console.error("Logout customer failed:", error)
    return {
      success: false,
      errors: ["Logout failed. Please try again"],
    }
  }
}

/**
 * Create a new customer account (sign up)
 */
export async function createCustomer(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  acceptsMarketing: boolean = false
): Promise<{
  success: boolean
  customer?: Customer
  errors?: string[]
}> {
  // Step 1: Define the GraphQL mutation
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `
  // Step 2: Prepare the variables
  const variables = {
    input: {
      firstName,
      lastName,
      email,
      password,
      acceptsMarketing,
    },
  }
  // Step 3: Send to Shopify and handle response
  try {
    const { shopifyFetch } = await import("./shopify")
    const data = await shopifyFetch(mutation, variables)

    // Step 4: Check if there are errors
    if (data.customerCreate.customerUserErrors.length > 0) {
      return {
        success: false,
        errors: data.customerCreate.customerUserErrors.map(
          (error: any) => error.message
        ),
      }
    }
    // Step 5: Return the created customer
    return {
      success: true,
      customer: data.customerCreate.customer,
    }
  } catch(error) {
    console.error("Create customer failed:", error)
    return {
      success: false,
      errors: ["Sign up failed. Please try again"],
    }
  }
}

/**
 * Get customer profile data using access token
 */
export async function getCustomer(
  accessToken: string
): Promise<{
  success: boolean
  customer?: CustomerData
  errors?: string[]
}> {
  // Step 1: Define the GraphQL query
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
    }
  `
  // Step 2: Prepare the variables
  const variables = {
    customerAccessToken: accessToken,
  }
  // Step 3: Send to Shopify and handle response
  try {
    const { shopifyFetch } = await import("./shopify")
    const data = await shopifyFetch(query, variables)

    // Step 4: Check if customer data exists
    if (!data.customer) {
      return {
        success: false,
        errors: ["Customer not found or token invalid"],
      }
    }
    // Step 5: Return the customer data
    return {
      success: true,
      customer: data.customer,
    }
  } catch(error) {
    console.error("Get customer failed:", error)
    return {
      success: false,
      errors: ["Failed to fetch customer data"],
    }
  }
}

/**
 * Renew customer access token before it expires
 */
export async function renewCustomerToken(
  accessToken: string
): Promise<{
  success: boolean
  accessToken?: CustomerAccessToken
  errors?: string[]
}> {
  // Step 1: Define the GraphQL mutation
  const mutation = `
    mutation customerAccessTokenRenew($customerAccessToken: String!) {
      customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }
  `
  // Step 2: Prepare the variables
  const variables = {
    customerAccessToken: accessToken,
  }
  // Step 3: Send to Shopify and handle response
  try {
    const { shopifyFetch } = await import("./shopify")
    const data = await shopifyFetch(mutation, variables)

    // Step 4: Check if there are errors
    if (data.customerAccessTokenRenew.userErrors.length > 0) {
      return {
        success: false,
        errors: data.customerAccessTokenRenew.userErrors.map(
          (error: any) => error.message
        ),
      }
    }
    // Step 5: Return the renewed access token
    return {
      success: true,
      accessToken: data.customerAccessTokenRenew.customerAccessToken,
    }
  } catch(error) {
    console.error("Renew customer token failed:", error)
    return {
      success: false,
      errors: ["Failed to renew token. Please log in again"],
    }
  }
}