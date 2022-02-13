# bs-datatable tests
A data table based on bootstrap 5 and jquery 3.5

# issues with running the tests on IIS server
We need to make sure that the Url Re-Write module is installed on the IIS

https://www.iis.net/downloads/microsoft/url-rewrite

in IIS give access IUSER -> full access
in IIS create a pool with local service
give local service full access to the app directory