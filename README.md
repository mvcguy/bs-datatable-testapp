# bs-datatable Samples
A data table based on bootstrap 5

Note: BS-Datatable v-1.1.0 has no depedency on jquery now

In this repository, two samples are provided to demonstrate how the data-table api can be used for
1. Creating a data-table purely in memory - static data
2. Create a data-table dependent on the backend for its data and pagination

# How to run the samples
First lets have a look at the final outcome of the sample app. As we can see in the following screen shots, we have demonstrated two samples, one is based on static in memory data and other one is dynamic and dependent on a backend API.

Steps:
  1. Clone this repository (https://github.com/mvcguy/bs-datatable-testapp.git)
  2. Make sure you have installed latest version Node JS (https://nodejs.org)
  3. For the code editor, i recommend Visual studio code (VS Code) which can be installed from here (https://code.visualstudio.com/)
  4. Open the cloned repository in VS Code and run the following command from the terminal in VS Code (CTRL + J)


    a. npm install
    b. npm run build
    c. npm run watch
    
    The last command will start express server on port 3000. The application can then be opened from the browser using the url:
    http://localhost:3000

1. Data is read from in memory, supports infinite scroll. 
![image](https://user-images.githubusercontent.com/12786083/154861361-5c4efec0-63eb-4c11-8ef5-3c33e6f619ac.png)

2. Data is read from API, support pagination through callbacks
![image](https://user-images.githubusercontent.com/12786083/155841553-8322309c-93ad-4e3a-96a2-d8729075be8d.png)

