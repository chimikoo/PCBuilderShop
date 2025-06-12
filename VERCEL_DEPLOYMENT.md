# Vercel Deployment Guide

This guide provides instructions for deploying the webshop application to Vercel with MongoDB Atlas integration.

## MongoDB Atlas Setup

For Vercel deployment, you need to use MongoDB Atlas (cloud-hosted MongoDB) instead of a local MongoDB instance.

### Step 1: Create a MongoDB Atlas Account and Cluster

1. Sign up for a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (the free tier is sufficient for development)
3. Choose a cloud provider and region (preferably close to your Vercel deployment region)
4. Click "Create Cluster" and wait for the cluster to be provisioned

### Step 2: Set Up Database Access

1. In the MongoDB Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Create a username and password (use a strong password)
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### Step 3: Configure Network Access

For Vercel deployment, you need to allow connections from Vercel's dynamic IP addresses:

1. Go to "Network Access" in the MongoDB Atlas dashboard
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (this adds `0.0.0.0/0`)
4. Click "Confirm"

### Step 4: Get Your Connection String

1. In the MongoDB Atlas dashboard, click "Connect"
2. Select "Connect your application"
3. Choose "Node.js" as the driver and the appropriate version
4. Copy the connection string (it will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
5. Replace `<username>` and `<password>` with your database user credentials
6. Replace `myFirstDatabase` with `webshop` (or your preferred database name)

## Vercel Environment Variables Setup

### Step 1: Add Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add a new environment variable:
   - Name: `MONGO_URI`
   - Value: Your MongoDB Atlas connection string from the previous step
4. Click "Save"

### Step 2: Redeploy Your Application

1. Trigger a new deployment in Vercel
2. Monitor the deployment logs for any database connection issues

## Troubleshooting

If you encounter database connection issues on Vercel:

1. Check the Vercel deployment logs for specific error messages
2. Verify that your MongoDB Atlas connection string is correctly set in Vercel environment variables
3. Ensure that MongoDB Atlas network access allows connections from anywhere (`0.0.0.0/0`)
4. Test the connection using the `/api/debug` endpoint we've created
5. Check if your MongoDB Atlas cluster is active and running

## Data Migration (Optional)

If you need to migrate data from your local MongoDB to Atlas:

1. Use MongoDB Compass to connect to your local MongoDB
2. Export your collections as JSON
3. Connect MongoDB Compass to your Atlas cluster
4. Import the JSON files into the corresponding collections

## Debugging

We've added a special debug endpoint to help diagnose database connection issues:

- Visit `/api/debug` on your deployed site to see database connection status and environment information
- Check the Vercel function logs for detailed connection information

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
