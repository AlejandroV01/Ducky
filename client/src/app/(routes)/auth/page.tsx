/* eslint-disable @next/next/no-img-element */
'use client'
import GoogleButton from '@/components/buttons/GoogleButton'
import SubmitButton from '@/components/buttons/SubmitButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Showcase from './Showcase'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signUp, signIn, verifyEmail } from '@/store/state/auth.slice'

// Design stuff
// Page currently responsive up to 300px screen width
// Added some 'ducky' color styles to the tailwind.config.ts
// Added some border styles to globals.css
// Created GoogleButton and SubmitButton components
// Installed ShadCN card, form, input, label, tabs

// Form stuff
// Installed zod for form validation
// Installed react-hook-form for form state management

// TODO
// Swag out the Dark Mode
// Eventually replacing the logo placeholder above the form
// Auth Functions (Sign Up, Sign In, Google Sign Up, Google Sign In)
// Left Screen Image Carousel

const signUpSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(255, { message: 'First name must be at most 255 characters long' }),
  last_name: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(255, { message: 'Last name must be at most 255 characters long' }),
  email: z.string().email({ message: 'Email must be a valid email' }),
  user_name: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters long' })
    .max(255, { message: 'Username must be at most 255 characters long' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(255, { message: 'Password must be at most 255 characters long' }),
})

const signInSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(255, { message: 'Password must be at most 255 characters long' }),
})

const verificationSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 characters'),
})

type SignUpFormValues = z.infer<typeof signUpSchema>
type SignInFormValues = z.infer<typeof signInSchema>
type VerificationFormValues = z.infer<typeof verificationSchema>

// Sign In / Sign Up Form w/ Dope yellow background on the left
export default function Auth() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isFormLoading, isVerifying, error, needsVerification, isAuthenticated } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      user_name: '',
      password: '',
    },
  })

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const verifyEmailForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  })

  // Placeholder function for Sign Up form submission logic
  const onSignUpSubmit = (values: SignUpFormValues) => {
    try {
      setEmail(values.email)
      dispatch(signUp(values))
    } catch (error) {
      console.error('Sign up failed:', error)
    }
  }

  const onVerifyEmail = (values: VerificationFormValues) => {
    try {
      dispatch(verifyEmail({
        email,
        code: values.code,
      }))

    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  // Placeholder function for Sign In form submission logic
  const onSignInSubmit = (values: SignInFormValues) => {
    try {
      console.log('Sign In:', values)
      dispatch(signIn(values))
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  return (
    <div className='flex w-full'>
      {/* Left yellow image carousel background placeholder */}
      <Showcase />

      {/* Right sign in / sign up form */}
      <div className='flex items-center justify-center max-[1250px]:w-full w-[44%] flex-col h-screen'>
        {/* Logo Placeholder */}
        <Link href={'/'}>
          <img src='/images/logo.svg' alt='app logo' className='w-[50px]' />
        </Link>

        <Tabs defaultValue='signup' className='max-[520px]:items-center max-[520px]:justify-center max-[520px]:w-full max-[520px]:px-6'>
          <TabsList className='h-[46px] bg-[#F1F5F9]'>
            <TabsTrigger value='signup' className='h-[36px] ml-[3px] text-md'>
              Sign Up
            </TabsTrigger>
            <TabsTrigger value='signin' className='h-[36px] ml-[3px] text-md mr-[3px]'>
              Login
            </TabsTrigger>
          </TabsList>
          {/* Sign Up Form */}
          <TabsContent value='signup'>
            <Card className='max-[520px]:w-full max-[480px]:p-[0] max-[480px]:px-[0] w-[495px] min-h-[536px] h-auto p-2 px-5 shadow-none form-border'>
              <CardHeader className='flex pb-[15px]'>
                <CardTitle className='text-[#8B97A8] text-[17px]'>Create an account</CardTitle>
              </CardHeader>
              <CardContent>
              { error && (<div className='text-red-600 text-lg'>{error}</div>)}
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={signUpForm.control}
                        name='first_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='max-[480px]:text-base text-lg'>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder='First Name' {...field} className='max-[520px]:w-full input-border text-md h-[41px] w-[193px]' />
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.first_name?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name='last_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='max-[480px]:text-base text-lg'>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder='Last Name' {...field} className='max-[520px]:w-full input-border text-md h-[41px] w-[193px]' />
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.last_name?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='flex gap-[12px] flex-col pt-[12px]'>
                      <FormField
                        control={signUpForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='max-[480px]:text-base text-lg'>Email</FormLabel>
                            <FormControl>
                              <Input
                                type='email'
                                placeholder='example@gmail.com'
                                {...field}
                                className='max-[520px]:w-full input-border text-md h-[41px]'
                              />
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.email?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name='user_name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='max-[480px]:text-base text-lg'>Username</FormLabel>
                            <FormControl>
                              <Input placeholder='Username' {...field} className='max-[520px]:w-full input-border text-md h-[41px]' />
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.user_name?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='max-[480px]:text-base text-lg'>Password</FormLabel>
                            <FormControl>
                              <Input type='password' placeholder='Password' {...field} className='max-[520px]:w-full input-border text-md h-[41px]' />
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.password?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='pt-[25px] flex flex-row justify-between max-[520px]:gap-4'>
                      <SubmitButton 
                        text={isFormLoading ? 'Loading...' : 'Sign Up'} 
                        pixelWidth={172} 
                        pixelHeight={46} 
                        isLoading={isFormLoading}
                      />
                      <GoogleButton />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Sign In Form */}
          <TabsContent value='signin'>
            <Card className='max-[520px]:w-full max-[480px]:p-[0] max-[480px]:px-[0] w-[495px] min-h-[358px] h-auto p-2 px-5 shadow-none form-border'>
              <CardHeader className='flex pb-[15px]'>
                <CardTitle className='text-[#8B97A8] text-[17px]'>Welcome back to Ducky</CardTitle>
              </CardHeader>
              <CardContent>
              { error && (<div className='text-red-600 text-lg'>{error}</div>)}
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignInSubmit)}>
                    <div className='flex gap-[12px] flex-col'>
                      <FormField
                        control={signInForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='max-[480px]:text-base text-lg'>Email</FormLabel>
                            <FormControl>
                              <Input placeholder='example@gmail.com' {...field} className='max-[520px]:w-full input-border text-md h-[41px]' />
                            </FormControl>
                            <FormMessage>{signInForm.formState.errors.email?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='max-[480px]:text-base text-lg'>Password</FormLabel>
                            <FormControl>
                              <Input type='password' placeholder='Password' {...field} className='max-[520px]:w-full input-border text-md h-[41px]' />
                            </FormControl>
                            <FormMessage>{signInForm.formState.errors.password?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='pt-[25px] flex flex-row justify-between max-[520px]:gap-4'>
                      <SubmitButton 
                        text={isFormLoading ? 'Loading...' : 'Login'} 
                        pixelWidth={172} 
                        pixelHeight={46} 
                        isLoading={isFormLoading}
                      />
                      <GoogleButton />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      { /* Verify Email Popup after SignIn */ }
      {needsVerification && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
          { error && (<div className='text-red-600 text-lg'>{error}</div>)}
          <Card className='w-[400px]'>
            <CardHeader>
              <CardTitle>Verify Email</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...verifyEmailForm}>
                <form onSubmit={verifyEmailForm.handleSubmit(onVerifyEmail)}>
                  <FormField
                    control={verifyEmailForm.control}
                    name='code'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder='Enter 6-digit code' 
                            {...field} 
                            maxLength={6}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <SubmitButton 
                    text={isVerifying ? 'Verifying...' : 'Verify'} 
                    pixelWidth={146} 
                    pixelHeight={46} 
                    isLoading={isVerifying}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
