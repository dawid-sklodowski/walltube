class YoutubeController < ApplicationController
  def show
    @user = User.find_by!(fb_user_id: params[:id])
  end
end
