Vue.component('nav-bar',{
    props : ['carts','cbadge'],
    data : function(){
        return {
            isadmin : false,
            islogin : false,
            login_email : '',
            login_password : '',
            failedLogin : false
        }
    },
    methods : {
        signin : function(){
            let email = this.login_email
            let password = this.login_password

            let data = {
                email,
                password
            }

            let self = this

            axios({
                method: "POST",
                url: 'http://localhost:3000/users/signin',
                data
            })
            .then(function (response) {
                // console.log(response.data)
                localStorage.setItem('token', response.data.token)
                if(response.data.isAdmin === true){
                    self.isadmin = true
                }
                self.islogin = true

                self.$emit('islogin-data',self.islogin)
                self.$emit('isadmin-data',self.isadmin)
            })
            .catch(function (err){
                self.failedLogin = true
                console.log(err)
            })
        },
        signout : function(){
            localStorage.removeItem('token')
            this.islogin = false
            this.isadmin = false
            this.$emit('islogin-data',this.islogin)
            this.$emit('isadmin-data',this.isadmin)
        },
        failedLoginFalse : function(){
            this.failedLogin = false
        }
    },
    template : `
    <div>

    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="index.html">Megaloshop</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarsExampleDefault">
                <ul class="navbar-nav m-auto">
                    <li class="nav-item active">
                        <a class="nav-link">Home<span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">Category</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">Product</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link">Contact</a>
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"
                            placeholder="Search...">
                        <div class="input-group-append">
                            <button type="button" class="btn btn-secondary btn-number">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                    <!-- CART BUTTON -->
                    <a class="btn btn-success btn-sm ml-3" data-toggle="modal" data-target="#cartModal" v-if='islogin === true && isadmin === false'>
                        <i class="fa fa-shopping-cart"></i> Carts
                        <span class="badge badge-light">{{cBadge}}</span>
                    </a>
                    <a class="btn btn-success btn-sm ml-3" data-toggle="modal" data-target="#loginModal" v-if='islogin === false'>
                        <i class="fa fa-sign-in-alt"></i> Login / Register
                    </a>
                    <a class="btn btn-success btn-sm ml-3" data-toggle="modal" data-target="#loginModal" v-if='isadmin === true'>
                        <i class="fa fa-sign-in-alt"></i> Add New Item
                    </a>
                    <a class="btn btn-success btn-sm ml-3" v-if='islogin === true' v-on:click="signout">
                        <i class="fa fa-sign-in-alt"></i> Signout
                    </a>
                </form>
            </div>
        </div>
    </nav>
    <div class="alert alert-warning" v-if="failedLogin" @click="failedLoginFalse">
        <strong>Error!</strong> Invalid username / password.
        <a class="close" data-dismiss="alert" aria-label="close">&times;</a>
    </div>
    
    <div class="modal fade" id="cartModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cart</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Sub-Total</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(cart, index) in carts">

                                        <td>{{cart.name}}</td>
                                        <td>$ {{cart.price}}</td>
                                        <td>{{cart.qty}}</td>
                                        <td>$ {{cart.totalPrice}}</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Checkout</button>
                    </div>
                </div>
            </div>
        </div>


        <div id="loginModal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Login / Register</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                            <fieldset>
                                <div id="legend">
                                    <legend class="">Login</legend>
                                </div>    
                                <div class="control-group">
                                    <!-- Username -->
                                    <label class="control-label" for="username">Email</label>
                                    <div class="controls">
                                        <input type="text" v-model="login_email" id="username" name="username" placeholder="" class="input-xlarge">
                                    </div>
                                </div>
            
                                <div class="control-group">
                                    <!-- Password-->
                                    <label class="control-label" for="password">Password</label>
                                    <div class="controls">
                                        <input type="password" v-model="login_password" id="password" name="password" placeholder="" class="input-xlarge">
                                    </div>
                                </div>
                            </fieldset>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="signin">Login</button>
                    </div>
            </div>
        </div>

    </div>
    `
})