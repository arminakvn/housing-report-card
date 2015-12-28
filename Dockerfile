
#	Copyright 2015, Google, Inc. 
# Licensed under the Apache License, Version 2.0 (the "License"); 
# you may not use this file except in compliance with the License. 
# You may obtain a copy of the License at 
#  
#    http://www.apache.org/licenses/LICENSE-2.0 
#  
# Unless required by applicable law or agreed to in writing, software 
# distributed under the License is distributed on an "AS IS" BASIS, 
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
# See the License for the specific language governing permissions and 
# limitations under the License.
#
# [START docker]
FROM gcr.io/google_appengine/nodejs
ADD package.json npm-shrinkwrap.json* /app/
RUN npm --unsafe-perm install
ADD . /app
WORKDIR /app
ADD package.json /usr/app/package.json
ADD bower.json /usr/app/bower.json
ADD lib /usr/app/lib
ADD scripts /usr/app/scripts
ADD app.js /usr/app/app.js
ADD app.yaml /usr/app/app.yaml
# EXPOSE 8080
# [END docker]