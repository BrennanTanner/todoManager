class BoardsController < ApplicationController
   before_action :authenticate_user!
   def new
      @boards = Board.new
   end
end