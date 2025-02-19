# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/ac9dfdf2-b935-4315-bd70-b50b1414c1e1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ac9dfdf2-b935-4315-bd70-b50b1414c1e1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Building with Docker

This project includes Docker support for easy deployment. To build and run the application using Docker:

1. Make sure you have Docker installed on your system
2. Make the build script executable:
   ```sh
   chmod +x build.sh
   ```
3. Run the build script:
   ```sh
   ./build.sh
   ```
   This will create a Docker image tagged with your application version.

4. To run the container locally:
   ```sh
   docker run -p 8080:80 lovable-app:<VERSION>
   ```
   Replace `<VERSION>` with your app version from package.json.

The Docker build uses a multi-stage process to create a lightweight production image using Nginx to serve the application.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

**Option 1: Using Lovable**
Simply open [Lovable](https://lovable.dev/projects/ac9dfdf2-b935-4315-bd70-b50b1414c1e1) and click on Share -> Publish.

**Option 2: Using Docker**
You can deploy the Docker image to any container hosting service that supports Docker:

1. Build the Docker image using the provided build script
2. Tag the image for your container registry:
   ```sh
   docker tag lovable-app:<VERSION> <registry-url>/lovable-app:<VERSION>
   ```
3. Push the image to your container registry:
   ```sh
   docker push <registry-url>/lovable-app:<VERSION>
   ```
4. Deploy using your preferred container hosting service (AWS ECS, Google Cloud Run, Azure Container Apps, etc.)

## Deploying to Kubernetes with Helm

This project includes Helm charts for deploying to Kubernetes. To deploy using Helm:

1. Make sure you have Helm installed and your kubectl context is set to the correct cluster

2. Build and push the Docker image to your registry:
   ```sh
   ./build.sh
   docker tag lovable-app:<VERSION> <registry-url>/lovable-app:<VERSION>
   docker push <registry-url>/lovable-app:<VERSION>
   ```

3. Install the Helm chart:
   ```sh
   helm install my-lovable-app ./helm/lovable-app \
     --set image.repository=<registry-url>/lovable-app \
     --set image.tag=<VERSION>
   ```

4. To enable ingress (optional):
   ```sh
   helm install my-lovable-app ./helm/lovable-app \
     --set image.repository=<registry-url>/lovable-app \
     --set image.tag=<VERSION> \
     --set ingress.enabled=true \
     --set ingress.hosts[0].host=your-domain.com
   ```

5. To update the deployment:
   ```sh
   helm upgrade my-lovable-app ./helm/lovable-app \
     --set image.repository=<registry-url>/lovable-app \
     --set image.tag=<NEW_VERSION>
   ```

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
