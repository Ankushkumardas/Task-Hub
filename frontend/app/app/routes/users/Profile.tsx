import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import z from 'zod'
import { useAuth } from '~/components/provider/authcontext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { usechangePasswordmutation, useUpdateProfilemutation, useUserProfileQuery } from '~/hooks/use-profile';
import {motion} from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
const changePassword=z.object({
  currentpassword:z.string().min(4,'Password must be at least 4 characters long'),
  newpassword:z.string().min(4,'Password must be at least 4 characters long'),
  confirmpassword:z.string().min(4,'Password must be at least 4 characters long')
}).refine((data)=>data.newpassword===data.confirmpassword,{
  message:"New password and confirm new password must match",
})

const profileSchema=z.object({
    name:z.string().min(2,'Name must be at least 2 characters long'),
    email:z.string().min(5,'Email must be at least 5 characters long').email('Invalid email address').optional(),
    profilePicture:z.string().url('Invalid URL').optional(),
})

export type ProfileSchema=z.infer<typeof profileSchema>;
export type ChangePasswordSchema=z.infer<typeof changePassword>;

const Profile = () => {
    const {data:user,isLoading,isError}=useUserProfileQuery();
    const {logout}=useAuth();
    const  navigate=useNavigate();
    console.log(user);
    const form=useForm<ChangePasswordSchema>({
        resolver:zodResolver(changePassword),
        defaultValues:{
            currentpassword:'',
            newpassword:'',
            confirmpassword:''
        }
    });

    const profileForm=useForm<ProfileSchema>({
        resolver:zodResolver(profileSchema),
        defaultValues:{
            name:user?.name||'',
            email:user?.email||'',
            profilePicture:user?.profilePicture||'',
        }
    });

    const {mutate}=useUpdateProfilemutation();

    const handleProfileSubmit=(data:ProfileSchema)=>{
        mutate({name:data.name,email:data.email},{
            onSuccess:(data:any)=>{
                toast.success("Profile updated successfully");
                console.log(data);
                navigate('/workspaces');
            },
            onError:(error:any)=>{
                console.log(error);
                toast.error("Error in updating profile");
            }
        })
    }

    const {mutate:changePasswordMutate}=usechangePasswordmutation();
    const handleChangePasswordSubmit=(data:ChangePasswordSchema)=>{
        changePasswordMutate({
            newpassword: data.newpassword,
            currentpassword: data.currentpassword,
            confirmpassword: data.confirmpassword
        }, {
            onSuccess: (data: any) => {
                console.log(data);
                toast.success("Password changed successfully, please login again");
                if (logout) {
                    logout();
                }   
               
                navigate('/login');
            }
        ,onError: (error: any) => {
            console.log(error);
            toast.error("Error in changing password");
          } 
        })
    }
    if(isLoading) return <div>Loading...</div>
    if(isError) return <div>Error in loading profile</div>
    if(!user) return <div>No user data found</div>
  return (
   <motion.div
      className="max-w-3xl mx-auto p-6 sm:p-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex justify-center mb-6">
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="update">Update Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        {/* --- Profile Info --- */}
        <TabsContent value="profile">
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="font-medium">Name:</span>
                <span>{user.user.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.user.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="font-medium">Email Verified:</span>
                <Badge
                  variant={user.user.isemailverified ? "default" : "destructive"}
                >
                  {user.user.isemailverified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="font-medium">2FA Enabled:</span>
                <Badge variant={user.user.is2FAenabled ? "default" : "secondary"}>
                  {user.user.is2FAenabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="font-medium">Last Login:</span>
                <span>{new Date(user.user.lastlogin).toLocaleString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="font-medium">Account Created:</span>
                <span>{new Date(user.user.createdAt).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Update Profile --- */}
        <TabsContent value="update">
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold text-gray-800">
                Update Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    {...profileForm.register("name")}
                    type="text"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...profileForm.register("email")}
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Profile Picture URL
                  </label>
                  <Input
                    {...profileForm.register("profilePicture")}
                    type="url"
                    placeholder="Enter profile picture URL"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Change Password --- */}
        <TabsContent value="password">
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-center text-xl font-semibold text-gray-800">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(handleChangePasswordSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium">
                    Current Password
                  </label>
                  <Input
                    {...form.register("currentpassword")}
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <Input
                    {...form.register("newpassword")}
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    {...form.register("confirmpassword")}
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

export default Profile
