class ScenariosController < ApplicationController
  before_action :set_scenario, only: [:show, :edit, :update, :destroy]

  # GET /scenarios
  def index
    respond_to do |format|
      format.html
      format.json {
        @scenarios = Scenario.all
        render json: @scenarios
      }
    end
  end

  # GET /scenarios/1
  def show
  end

  # POST /scenarios
  def create
    @scenario = Scenario.new(scenario_params)

    if @scenario.save
      redirect_to @scenario, notice: 'Scenario was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /scenarios/1
  def update
    if @scenario.update(scenario_params)
      render json: @scenario
    else
      render json: @scenario.errors, status: :unprocessable_entity
    end
  end

  # DELETE /scenarios/1
  def destroy
    @scenario.destroy
    redirect_to scenarios_url, notice: 'Scenario was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_scenario
      @scenario = Scenario.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def scenario_params
      params.require(:scenario).permit(:title, :description, :order, :active)
    end
end
