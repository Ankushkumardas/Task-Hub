import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import z from 'zod'
import { useAuth } from '~/components/provider/authcontext';
import { usechangePasswordmutation, useUpdateProfilemutation, useUserProfileQuery } from '~/hooks/use-profile';

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

  return (
    <div className="profile-page">
      <style>
        {`
          .profile-page {
            max-width: 400px;
            margin: 40px auto;
            padding: 32px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            font-family: 'Segoe UI', Arial, sans-serif;
          }
          .profile-page h2, .profile-page h3 {
            text-align: center;
            margin-bottom: 18px;
            color: #333;
          }
          .profile-page form {
            margin-bottom: 28px;
          }
          .profile-page label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #444;
          }
          .profile-page input {
            width: 100%;
            padding: 8px 10px;
            margin-bottom: 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 15px;
            transition: border-color 0.2s;
          }
          .profile-page input:focus {
            border-color: #0078d4;
            outline: none;
          }
          .profile-page button {
            background: #0078d4;
            color: #fff;
            border: none;
            padding: 10px 0;
            border-radius: 6px;
            width: 100%;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
            transition: background 0.2s;
          }
          .profile-page button:hover {
            background: #005fa3;
          }
          .profile-page span {
            color: #d32f2f;
            font-size: 13px;
            margin-bottom: 6px;
            display: block;
          }
          .profile-page div {
            margin-bottom: 16px;
          }
        `}
      </style>
      <h2>Profile</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error loading profile.</p>
      ) : (
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
          <div>
            <label>Name:</label>
            <input
              {...profileForm.register('name')}
              type="text"
              placeholder="Name"
            />
            {profileForm.formState.errors.name && (
              <span>{profileForm.formState.errors.name.message}</span>
            )}
          </div>
          <div>
            <label>Email:</label>
            <input
              {...profileForm.register('email')}
              type="email"
              placeholder="Email"
            />
            {profileForm.formState.errors.email && (
              <span>{profileForm.formState.errors.email.message}</span>
            )}
          </div>
          <div>
            <label>Profile Picture URL:</label>
            <input
              {...profileForm.register('profilePicture')}
              type="url"
              placeholder="Profile Picture URL"
            />
            {profileForm.formState.errors.profilePicture && (
              <span>{profileForm.formState.errors.profilePicture.message}</span>
            )}
          </div>
          <button type="submit">Update Profile</button>
        </form>
      )}

      <h3>Change Password</h3>
      <form onSubmit={form.handleSubmit(handleChangePasswordSubmit)}>
        <div>
          <label>Current Password:</label>
          <input
            {...form.register('currentpassword')}
            type="password"
            placeholder="Current Password"
          />
          {form.formState.errors.currentpassword && (
            <span>{form.formState.errors.currentpassword.message}</span>
          )}
        </div>
        <div>
          <label>New Password:</label>
          <input
            {...form.register('newpassword')}
            type="password"
            placeholder="New Password"
          />
          {form.formState.errors.newpassword && (
            <span>{form.formState.errors.newpassword.message}</span>
          )}
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            {...form.register('confirmpassword')}
            type="password"
            placeholder="Confirm New Password"
          />
          {form.formState.errors.confirmpassword && (
            <span>{form.formState.errors.confirmpassword.message}</span>
          )}
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  )
}

export default Profile
