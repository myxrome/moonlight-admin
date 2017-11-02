class ScenesController < ApplicationController
  before_action :set_scene, only: [:update, :destroy]

  # GET /scenes
  def index
    @scenes = Scene.where(search_params).all
    render json: @scenes
  end

  # POST /scenes
  def create
    @scene = Scene.new(scene_params)

    if @scene.save
      render json: @scene, status: :created, location: @scene
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /scenes/1
  def update
    if @scene.update(scene_params)
      render json: @scene
    else
      render json: @scene.errors, status: :unprocessable_entity
    end
  end

  # DELETE /scenes/1
  def destroy
    @scene.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_scene
      @scene = Scene.find(params[:id])
    end

    def search_params
      params.permit(:stage_id)
    end
    # Only allow a trusted parameter "white list" through.
    def scene_params
      params.require(:scene).permit(:stage_id, :content, :sex, :example)
    end
end
