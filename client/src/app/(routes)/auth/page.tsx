'use client'
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import SubmitButton from "@/components/buttons/SubmitButton"
import GoogleButton from "@/components/buttons/GoogleButton"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const signUpSchema = z.object({
  firstName: z.string()
  .min(2, {message: 'First name must be at least 2 characters long'})
  .max(255, {message: 'First name must be at most 255 characters long'}),
  lastName: z.string()
  .min(2, {message: 'Last name must be at least 2 characters long'})
  .max(255, {message: 'Last name must be at most 255 characters long'}),
  email: z.string()
  .email({message: 'Email must be a valid email'}),
  username: z.string()
  .min(2, {message: 'Username must be at least 2 characters long'})
  .max(255, {message: 'Username must be at most 255 characters long'}),
  password: z.string()
  .min(8, {message: 'Password must be at least 8 characters long'})
  .max(255, {message: 'Password must be at most 255 characters long'})
})

const signInScheme = z.object({
  username: z.string()
  .min(2, {message: 'Username must be at least 2 characters long'})
  .max(255, {message: 'Username must be at most 255 characters long'}),
  password: z.string()
  .min(8, { message: 'Password must be at least 8 characters long'})
  .max(255, { message: 'Password must be at most 255 characters long'}),
})

type SignUpFormValues = z.infer<typeof signUpSchema>
type SignInFormValues = z.infer<typeof signInScheme>

// Sign In / Sign Up Form w/ Dope yellow background on the left
export default function Auth() {

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
    },
  })

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInScheme),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // Placeholder function for Sign Up form submission logic
  const onSignUpSubmit = (values: SignUpFormValues) => {
    console.log(values)
  }

  // Placeholder function for Sign In form submission logic
  const onSignInSubmit = (values: SignInFormValues) => {
    console.log(values)
  }

  // Placeholder function for Google Sign Up
  const onGoogleSignUp = () => {
    console.log('Google Sign Up')
  }

  // Placeholder function for Google Sign In
  const onGoogleSignIn = () => {
    console.log('Google Sign In')
  }

  return (
    <div className='flex'>

      {/* Left yellow image carousel background placeholder */}
      <div className='bg-yellow-500 h-screen w-[55%]'></div>

      {/* Right sign in / sign up form */}
      <div>
        <Tabs defaultValue='signup'>
          <TabsList>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
            <TabsTrigger value='signin'>Sign In</TabsTrigger>
          </TabsList>
          {/* Sign Up Form */}
          <TabsContent value='signup'>
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
                    <div>
                      <FormField
                        control={signUpForm.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First Name" {...field}/>
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.firstName?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last Name" {...field}/>
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.lastName?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={signUpForm.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="example@gmail.com" {...field}/>
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.email?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name='username'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Username" {...field}/>
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.username?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Password" {...field}/>
                            </FormControl>
                            <FormMessage>{signUpForm.formState.errors.password?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <SubmitButton text={"Continue"}/>
                      <GoogleButton onPoke={onGoogleSignIn} text={"Google"}/>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Sign In Form */}
          <TabsContent value='signin'>
            <Card>
              <CardHeader>
                <CardTitle>Welcome back to Ducky</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignInSubmit)}>
                    <div>
                      <FormField
                        control={signInForm.control}
                        name='username'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Username" {...field}/>
                            </FormControl>
                            <FormMessage>{signInForm.formState.errors.username?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name='password'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Password" {...field}/>
                            </FormControl>
                            <FormMessage>{signInForm.formState.errors.password?.message}</FormMessage>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <SubmitButton text={"Continue"}/>
                      <GoogleButton onPoke={onGoogleSignUp} text={"Google"}/>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  )
}
